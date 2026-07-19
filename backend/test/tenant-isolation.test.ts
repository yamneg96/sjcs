import mongoose from "mongoose";
import Subject from "../src/modules/subjects/subject.model";
import Section from "../src/modules/sections/section.model";
import AcademicYear from "../src/modules/academic-years/academic-year.model";
import { TenantRepository } from "../src/infrastructure/database/tenant-repository";
import { runWithContext } from "../src/shared/context/request-context";
import { AcademicYearService } from "../src/modules/academic-years/academic-year.service";
import { SectionService } from "../src/modules/sections/section.service";

/**
 * NON-NEGOTIABLE GATE (§49): tenant isolation.
 * A user in Org A must never read or write any Org B resource.
 */

const ORG_A = new mongoose.Types.ObjectId().toString();
const ORG_B = new mongoose.Types.ObjectId().toString();
const USER = new mongoose.Types.ObjectId();

const asTenant = <T>(tenantId: string, fn: () => Promise<T>) =>
  runWithContext({ requestId: "test", tenantId, userId: USER.toString() }, fn);

describe("tenant isolation", () => {
  beforeEach(async () => {
    await Promise.all([
      Subject.deleteMany({}),
      Section.deleteMany({}),
      AcademicYear.deleteMany({}),
    ]);
  });

  it("scopes reads to the caller's tenant", async () => {
    const subjects = new TenantRepository(Subject);

    await asTenant(ORG_A, () =>
      subjects.create({ name: "Biology", slug: "biology", grade: 9, createdBy: USER })
    );
    await asTenant(ORG_B, () =>
      subjects.create({ name: "Physics", slug: "physics", grade: 9, createdBy: USER })
    );

    const aSubjects = await asTenant(ORG_A, () => subjects.find({}));
    const bSubjects = await asTenant(ORG_B, () => subjects.find({}));

    expect(aSubjects.map((s) => s.name)).toEqual(["Biology"]);
    expect(bSubjects.map((s) => s.name)).toEqual(["Physics"]);
  });

  it("stamps the caller's tenantId on create, ignoring any supplied value", async () => {
    const subjects = new TenantRepository(Subject);

    // A malicious caller tries to plant a record in another tenant.
    const created = await asTenant(ORG_A, () =>
      subjects.create({
        name: "Injected",
        slug: "injected",
        grade: 9,
        createdBy: USER,
        tenantId: ORG_B,
      })
    );

    expect(created.tenantId).toBe(ORG_A);
    const leaked = await asTenant(ORG_B, () => subjects.find({}));
    expect(leaked).toHaveLength(0);
  });

  it("cannot read another tenant's document by id", async () => {
    const subjects = new TenantRepository(Subject);
    const a = await asTenant(ORG_A, () =>
      subjects.create({ name: "Secret", slug: "secret", grade: 9, createdBy: USER })
    );

    const stolen = await asTenant(ORG_B, () => subjects.findById(a._id.toString()));
    expect(stolen).toBeNull();
  });

  it("blocks a cross-tenant foreign-key reference (section → academic year)", async () => {
    const year = await asTenant(ORG_A, () =>
      AcademicYearService.create(USER.toString(), {
        name: "2025/2026",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-06-30"),
      })
    );

    // Org B tries to attach a section to Org A's academic year.
    await expect(
      asTenant(ORG_B, () =>
        SectionService.create(USER.toString(), {
          name: "A",
          grade: 9,
          academicYearId: year._id.toString(),
        })
      )
    ).rejects.toThrow();
  });

  it("refuses to run without a tenant context", () => {
    const subjects = new TenantRepository(Subject);
    // Throws synchronously while building the scoped filter — before any query
    // reaches the database, which is exactly the intent.
    expect(() => subjects.find({})).toThrow(/Tenant context missing/);
  });
});
