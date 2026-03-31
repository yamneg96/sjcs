export default function PaymentsPage() {
  const payments = [
    { term: "Fall 2024", amount: "$8,500", status: "Paid", date: "Aug 15, 2024" },
    { term: "Spring 2025", amount: "$8,500", status: "Due", date: "Jan 15, 2025" },
    { term: "Activity Fee", amount: "$350", status: "Paid", date: "Sep 1, 2024" },
    { term: "Technology Fee", amount: "$200", status: "Paid", date: "Sep 1, 2024" },
  ];

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Financial</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Tuition <span className="text-sjcs-primary">Payments</span></h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient text-center">
            <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mb-2">Total Due</p>
            <p className="font-headline text-3xl font-bold text-sjcs-primary">$8,500</p>
          </div>
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient text-center">
            <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mb-2">Total Paid</p>
            <p className="font-headline text-3xl font-bold text-green-600">$9,050</p>
          </div>
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient text-center">
            <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mb-2">Next Due Date</p>
            <p className="font-headline text-3xl font-bold text-sjcs-secondary">Jan 15</p>
          </div>
        </div>

        <div className="bg-sjcs-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
          <div className="p-8 border-b border-sjcs-surface-container flex justify-between items-center">
            <h2 className="font-headline text-xl font-bold">Payment History</h2>
            <button className="leadership-gradient text-white px-6 py-2 rounded-lg font-label text-[10px] font-bold tracking-widest uppercase">
              Make Payment
            </button>
          </div>
          <div className="divide-y divide-sjcs-surface-container">
            {payments.map((p, i) => (
              <div key={i} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{p.term}</p>
                  <p className="text-xs text-sjcs-on-surface-variant">{p.date}</p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-headline font-bold">{p.amount}</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
