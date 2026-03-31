import { Link } from "@tanstack/react-router";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 leadership-gradient opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div
            className="h-full w-full bg-cover bg-center rounded-bl-[120px] shadow-2xl"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvB1jt3JLYg3MufHkbn28u992-RZCGNrx1IQ5cGllBqYTlQj64-3zjiSNjquLIAmGNvMXNy32658a-yfgNvGLrjki5SyG0LBlZ23FSuwTPGZdjE4Ygi6M8a_ra-if-S9uCfpIIjQtZxWU2B0OqVJb5Q38rtGAmUFzZEMQuA7cJiUwpgPztVRlska5j3Tsw1czIlNxTO4qlalFsWeQ27N4iqxlWP0Qn6B7u3wh0Tjx70LeDGu07U-KqsebboHUO7qrV-GsKgsu7-Evb')",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-sjcs-primary-fixed text-sjcs-on-primary-fixed font-label text-xs font-bold tracking-[0.1em] uppercase">
              Excellence in Leadership
            </div>
            <h1 className="font-headline text-6xl md:text-7xl font-extrabold text-sjcs-on-surface tracking-tight leading-tight mb-8">
              Faith, Knowledge, <br />
              and <span className="text-sjcs-primary">Service.</span>
            </h1>
            <p className="text-sjcs-on-surface-variant text-xl leading-relaxed mb-10 max-w-lg">
              Preparing the next generation of leaders through a rigorous
              academic curriculum grounded in Catholic values and intellectual
              discovery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admissions" className="leadership-gradient text-white px-8 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase shadow-xl hover:shadow-sjcs-primary/20 transition-all">
                Apply Now
              </Link>
              <Link to="/academics" className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-8 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase hover:bg-sjcs-surface-variant transition-all">
                Explore Academics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview: Intentional Asymmetry */}
      <section className="py-32 bg-sjcs-surface">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-7 relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <img
                    className="rounded-xl shadow-lg w-full h-[400px] object-cover"
                    alt="Students in a collaborative science experiment"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO2hMxMG-qAFLXVEFw9jfmRvE0hPfW-vo9bFnOo9XF35spbOAqsaW5j_KcCyT6TwbKlsuZ_CT2Kz0TqGEzEb_tn3Q1sRxxT2uOip_HzG05M3wU4u0zLKBjIrnn6GF_sF_gyg30ZCq3uzHSih2Au8EJ8wD_mcaYgykbv2bPGa8jOMbYrbBQvyRTJ6_qRanW9eNv2pZ6kdX8gT89qjdXQs7cJZXs_KPf8hsMiM5GSym3JJZYB1Xt0BkH6KkrtqtPQmT05P60so23LmKz"
                  />
                  <div className="bg-sjcs-secondary-container p-8 rounded-xl text-sjcs-on-secondary-container">
                    <h3 className="font-headline text-3xl font-bold mb-2">98%</h3>
                    <p className="font-label text-xs uppercase tracking-widest">
                      College Placement Rate
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-sjcs-primary-container p-8 rounded-xl text-sjcs-on-primary-container">
                    <h3 className="font-headline text-3xl font-bold mb-2">12:1</h3>
                    <p className="font-label text-xs uppercase tracking-widest">
                      Student-Teacher Ratio
                    </p>
                  </div>
                  <img
                    className="rounded-xl shadow-lg w-full h-[400px] object-cover"
                    alt="Historical school library"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI-tciomtjuB_9oLt8EFexrSlInouIT3y-wVHHFSp6RIrGdrooSCzLBIMnA4Sla4d8pg9Fkm7QrExn9ZElmrbrtV_9fcbIHKDBoyNg4TSZMw0_31KoEUSZsgJJvHX1QBHQqft3RjUSuq-DdiJ8VNQDkMOv4-uwTExrg0uJYF_G_rX6JBeawGfNCCPnCocFTlD87lWwACxq4Z0U97CvdEG8gvzKnOMInpm-rcf1tv3ufW4IuXSYa_acIoJec2GnC6_VaBvGt2_Yo8LF"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <h2 className="font-headline text-4xl font-bold mb-8 text-sjcs-on-surface">
                The SJCS Legacy of{" "}
                <span className="text-sjcs-secondary">Distinction</span>
              </h2>
              <p className="text-sjcs-on-surface-variant leading-relaxed text-lg mb-8">
                Founded on the principles of holistic education, Saint Joseph
                Catholic School fosters an environment where students are
                encouraged to question, explore, and excel. Our curriculum is
                designed to challenge the mind while nurturing the spirit.
              </p>
              <ul className="space-y-6 mb-10">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-sjcs-primary">
                    verified
                  </span>
                  <div>
                    <h4 className="font-bold text-sjcs-on-surface">
                      National Merit Scholars
                    </h4>
                    <p className="text-sm text-sjcs-on-surface-variant">
                      Consistent top-tier placement in national academic
                      competitions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-sjcs-primary">
                    temple_buddhist
                  </span>
                  <div>
                    <h4 className="font-bold text-sjcs-on-surface">
                      Spiritual Foundation
                    </h4>
                    <p className="text-sm text-sjcs-on-surface-variant">
                      Daily prayer and weekly Mass integrating faith into the
                      academic life.
                    </p>
                  </div>
                </li>
              </ul>
              <Link
                to="/about"
                className="text-sjcs-secondary font-bold inline-flex items-center gap-2 group"
              >
                Learn about our mission
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Excellence Highlights: Bento Grid */}
      <section className="py-24 bg-sjcs-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold mb-4">
              Academic Excellence
            </h2>
            <div className="w-20 h-1 bg-sjcs-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 bg-sjcs-surface-container-lowest p-10 rounded-xl flex flex-col justify-between hover:shadow-xl transition-shadow border-b-4 border-sjcs-primary">
              <div>
                <span className="material-symbols-outlined text-5xl text-sjcs-primary mb-6">
                  science
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">
                  Advanced STEM Programs
                </h3>
                <p className="text-sjcs-on-surface-variant">
                  Our state-of-the-art labs and robotics centers provide
                  students with hands-on experience in emerging technologies and
                  scientific research.
                </p>
              </div>
              <Link to="/academics" className="mt-8 text-sjcs-primary font-bold flex items-center gap-2">
                Explore Labs{" "}
                <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
            <div className="md:col-span-2 bg-sjcs-secondary p-10 rounded-xl text-white flex items-center gap-8">
              <div className="flex-1">
                <h3 className="font-headline text-2xl font-bold mb-2">
                  Liberal Arts Core
                </h3>
                <p className="text-white/80">
                  Developing critical thinking through classical literature,
                  philosophy, and history.
                </p>
              </div>
              <div className="hidden lg:flex w-32 h-32 rounded-lg bg-white/10 backdrop-blur items-center justify-center">
                <span className="material-symbols-outlined text-4xl">
                  menu_book
                </span>
              </div>
            </div>
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl flex flex-col justify-center border-t-4 border-sjcs-secondary">
              <span className="material-symbols-outlined text-3xl text-sjcs-secondary mb-4">
                translate
              </span>
              <h3 className="font-bold text-lg">Modern Languages</h3>
            </div>
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl flex flex-col justify-center border-t-4 border-sjcs-secondary">
              <span className="material-symbols-outlined text-3xl text-sjcs-secondary mb-4">
                palette
              </span>
              <h3 className="font-bold text-lg">Fine Arts Academy</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Student Life: Visual Carousel Preview */}
      <section className="py-32 bg-sjcs-surface">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="font-headline text-4xl font-bold mb-4">
                Life at Saint Joseph
              </h2>
              <p className="text-sjcs-on-surface-variant">
                Beyond the classroom, our students engage in a vibrant community
                of athletes, artists, and leaders.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border-ghost flex items-center justify-center hover:bg-sjcs-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 rounded-full border-ghost flex items-center justify-center hover:bg-sjcs-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz5EBKIbz4pc43-2e1pEj-XG55kGqkqTdfXMK-6Tpo1UOo87D8j4w9TDSWEhyFoeA44K8CeFFtKgkG324kFvOKaRxGiDb7bSiWLjfUgIN__hVPHDaW_guhZKw8QIdv2LKIdc7h8rYaboa-XCjzZywz5SoR9Q7q4zJCg1PxnZSQsmaeZz1aYThDWqdamKmca1XLvCukHMDs1ugcOGqMC0KmT5B9q_ZVMOlPCbe_hHVq-19crA4Qcn3ShJcmjPdpin_JPqMEEjGqUFS8",
                label: "Athletics",
                title: "Championship Spirit",
                color: "text-sjcs-primary",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-1twPZ5VXCHyhYp_fDn0u3ih1Ey5AxG9_cDqRSel_TQwN6u5X0z7G_lxhTjqluqw5ktDtyK06zONIYFq-cOqPfZXhT0o-rsSda1WsQR5fG5o_9b1A8VfPr_ef8vEb7HlRI8ITnxiWacTmKNXoc8Pb7DBxZ3LD7-JpEds_duLK8Uz3fUOJ7cu3uQCR1quBEsBamG5Rv_Yyl6ea6TlCviKssKmIXrpkVvWWVE0NeaGSHR8lXIhxY7RHhB2lCLzXDUe_sIsw5QFeXxeU",
                label: "Arts & Music",
                title: "Creative Expression",
                color: "text-sjcs-secondary",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRz6kJIXQmOzFftfLc8wOMyDRPnvajS8J7obW5DFj5ixUNA6xBVbl-ExMkpLIplQ_iLEGGl3hA3wRHdVUT9wtvlJio929taQXRNUShkjhqNvE0GVSrKGrQbf7UyhB3Nf2MS09-INVfdMvD9OgcbevebHPgzK9ljpb8x2OMSF3BSRNvnhvxvsVRhVUfCGULK8f9vX7VOoXr48hZAmwMxFLNozg_IG55kZuQrnHb3w9fmu6x--3tvU3knLcKxGDD9-CaqL-E6vh2ecEu",
                label: "Service",
                title: "Leadership through Service",
                color: "text-sjcs-primary",
              },
            ].map((item) => (
              <div key={item.title} className="group cursor-pointer overflow-hidden rounded-xl">
                <div className="relative h-[500px]">
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={item.title}
                    src={item.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/90 to-transparent p-8 flex flex-col justify-end">
                    <span
                      className={`${item.color} font-bold text-xs tracking-widest uppercase mb-2`}
                    >
                      {item.label}
                    </span>
                    <h3 className="text-white text-2xl font-bold">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 bg-sjcs-surface-container-high/30">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold">
              SJCS News &amp; Updates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgRxp2CB9bW8a0ZiOqKxiogbzTNLVswLe6w1w3gOQFA6o-jkqy6lkwR3VcOe97OeYkC0DrifcLeDa5SjBX70uGq8XJKsUBNdYrEgHxnP1yuJnDTxPkv6P5sr3G8vcsfKjNHmvmItJ2O4H7sR82ehj73Q1Cv5mEEcQErLIHGXX_i7js3Y4Zvg2RORr5vUBnnLYMRr2TtwL9w6lC7csyg1T3M-a8guKUZG01es2C-5-tuxaTEtU5XDBCqpOKLJksBsiadfz_6fJnIgOo",
                date: "June 12, 2024",
                category: "Achievement",
                categoryColor: "text-sjcs-primary",
                title: "SJCS Robotics Team Qualifies for World Championships",
                excerpt: "Our senior robotics team outperformed 40 other regional schools to secure a spot in the international finals...",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXAZfzZf2HkDTXKidtZ2eUyosT5UWc-a8PEhQmoVN8Xl5O9hzuyxxIRMDx074K8nbLnVJBgd2PFduUl3GO6nUW6sKjvKkfLQxZn87KCjnhWSE5dVsVu6h_I7gIfB7DglZlLthiGoNArYAIQJqpsc5-jXAtxyWS5tDZ3XBI6qlgBt4LEiRQUjiGvqdFvvxBuYdoYdCkU_IX6H_1LNKt_zu9aqcCvnTE7T54LrJmdBV-M82e4gGFpBX3ZlIQXxcC7Gq_bppXgs1UU4cb",
                date: "May 28, 2024",
                category: "Academics",
                categoryColor: "text-sjcs-secondary",
                title: "New Dual-Enrollment Program Announced with Regional Universities",
                excerpt: "Starting this Fall, juniors and seniors can earn up to 15 college credits through our new partnership...",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXUfmBOcgNqP1jZLEagF1Kw_SDM7BtMt0szGpLMVzZ1VBim7uNN8EeLxtOJ8-JZxTbbQnjtofmmkznpqFvl8fZWPtYW3Dl575tZtatMComuiX9r_r9QspLZVfpyyOEq5lK6e_lwAxCl-fbIZ2mP-kN4AZuXj81sMvAEpZaaJvAEpDTblDYdPQ52j-22UrpoEhSDWxT0s2atbQ4MFfSUBU6Z4lJZ3yJ_Qd34tyGjVcPZZnDuJ0Gmqdw7OmdDbT-nvs9xVeNSodvsHst",
                date: "May 15, 2024",
                category: "Community",
                categoryColor: "text-sjcs-primary",
                title: "Annual Leadership Gala Raises $250k for Scholarship Fund",
                excerpt: "The community came together for an evening of celebration, ensuring that an SJCS education remains accessible...",
              },
            ].map((news) => (
              <div
                key={news.title}
                className="bg-sjcs-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url('${news.img}')` }}
                ></div>
                <div className="p-8">
                  <div className="flex gap-4 text-xs font-bold text-sjcs-on-surface-variant/60 uppercase tracking-widest mb-4">
                    <span>{news.date}</span>
                    <span>•</span>
                    <span className={news.categoryColor}>{news.category}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-4 leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-sjcs-on-surface-variant text-sm line-clamp-2 mb-6">
                    {news.excerpt}
                  </p>
                  <Link
                    to="/news"
                    className="font-bold text-sm underline decoration-sjcs-primary/30 hover:decoration-sjcs-primary transition-all"
                  >
                    Read Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-sjcs-surface overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/3">
              <h2 className="font-headline text-4xl font-bold mb-6">
                Voices of <br />
                Our Community
              </h2>
              <p className="text-sjcs-on-surface-variant mb-8">
                Hear from the families and students who make Saint Joseph a
                center of excellence.
              </p>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sjcs-primary"
                  >
                    grade
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="bg-sjcs-surface-container-low p-12 rounded-2xl relative">
                <span className="material-symbols-outlined text-8xl text-sjcs-outline-variant/20 absolute -top-4 -left-4">
                  format_quote
                </span>
                <p className="text-2xl font-medium leading-relaxed mb-10 italic">
                  "The academic rigour at SJCS is unmatched, but it's the
                  character development and the moral compass they instill in
                  students that truly sets them apart. My daughter has grown from
                  a student into a confident, compassionate leader."
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDY096GciXB8SMnkJmyh-IzXIu2M2DRf1zQoDgGhFOvw1gONOeB47GAD50zt_jNqhFJC9UO4_skQFKJgXt8zs9v7GibSzLGEjCbYgtqXeq9nBCOLhmefK-ZcrPPr_Y2HS4IdvZLPQ281-XOy7zbTq7AU2MoOswt9zxwuo6vjwRSxqTZUDAQWu0sSNhgXAPBj3R_zndrNnfrwZtnS9FR6qL8fph18rR2ojJrJv07gs0jB3OhlRqOMtFXWupYb401skyEgbyZWBpOzD_y')",
                    }}
                  ></div>
                  <div>
                    <h4 className="font-bold text-sjcs-on-surface">
                      Elena Rodriguez
                    </h4>
                    <p className="text-sm text-sjcs-on-surface-variant">
                      Class of 2024 Parent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
