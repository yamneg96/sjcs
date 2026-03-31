import { Link } from "@tanstack/react-router";

export default function NewsPage() {
  const articles = [
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgRxp2CB9bW8a0ZiOqKxiogbzTNLVswLe6w1w3gOQFA6o-jkqy6lkwR3VcOe97OeYkC0DrifcLeDa5SjBX70uGq8XJKsUBNdYrEgHxnP1yuJnDTxPkv6P5sr3G8vcsfKjNHmvmItJ2O4H7sR82ehj73Q1Cv5mEEcQErLIHGXX_i7js3Y4Zvg2RORr5vUBnnLYMRr2TtwL9w6lC7csyg1T3M-a8guKUZG01es2C-5-tuxaTEtU5XDBCqpOKLJksBsiadfz_6fJnIgOo", date: "June 12, 2024", category: "Achievement", categoryColor: "text-sjcs-primary", title: "SJCS Robotics Team Qualifies for World Championships", excerpt: "Our senior robotics team outperformed 40 other regional schools to secure a spot in the international finals held in Geneva." },
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXAZfzZf2HkDTXKidtZ2eUyosT5UWc-a8PEhQmoVN8Xl5O9hzuyxxIRMDx074K8nbLnVJBgd2PFduUl3GO6nUW6sKjvKkfLQxZn87KCjnhWSE5dVsVu6h_I7gIfB7DglZlLthiGoNArYAIQJqpsc5-jXAtxyWS5tDZ3XBI6qlgBt4LEiRQUjiGvqdFvvxBuYdoYdCkU_IX6H_1LNKt_zu9aqcCvnTE7T54LrJmdBV-M82e4gGFpBX3ZlIQXxcC7Gq_bppXgs1UU4cb", date: "May 28, 2024", category: "Academics", categoryColor: "text-sjcs-secondary", title: "New Dual-Enrollment Program Announced with Regional Universities", excerpt: "Starting this Fall, juniors and seniors can earn up to 15 college credits through our new partnership with three leading universities." },
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXUfmBOcgNqP1jZLEagF1Kw_SDM7BtMt0szGpLMVzZ1VBim7uNN8EeLxtOJ8-JZxTbbQnjtofmmkznpqFvl8fZWPtYW3Dl575tZtatMComuiX9r_r9QspLZVfpyyOEq5lK6e_lwAxCl-fbIZ2mP-kN4AZuXj81sMvAEpZaaJvAEpDTblDYdPQ52j-22UrpoEhSDWxT0s2atbQ4MFfSUBU6Z4lJZ3yJ_Qd34tyGjVcPZZnDuJ0Gmqdw7OmdDbT-nvs9xVeNSodvsHst", date: "May 15, 2024", category: "Community", categoryColor: "text-sjcs-primary", title: "Annual Leadership Gala Raises $250k for Scholarship Fund", excerpt: "The community came together for an evening of celebration, ensuring that an SJCS education remains accessible to all deserving students." },
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO2hMxMG-qAFLXVEFw9jfmRvE0hPfW-vo9bFnOo9XF35spbOAqsaW5j_KcCyT6TwbKlsuZ_CT2Kz0TqGEzEb_tn3Q1sRxxT2uOip_HzG05M3wU4u0zLKBjIrnn6GF_sF_gyg30ZCq3uzHSih2Au8EJ8wD_mcaYgykbv2bPGa8jOMbYrbBQvyRTJ6_qRanW9eNv2pZ6kdX8gT89qjdXQs7cJZXs_KPf8hsMiM5GSym3JJZYB1Xt0BkH6KkrtqtPQmT05P60so23LmKz", date: "April 30, 2024", category: "Campus Life", categoryColor: "text-sjcs-tertiary", title: "Spring Science Fair Winners Announced", excerpt: "Students from grades 9-12 presented innovative research projects covering topics from renewable energy to genetic engineering." },
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI-tciomtjuB_9oLt8EFexrSlInouIT3y-wVHHFSp6RIrGdrooSCzLBIMnA4Sla4d8pg9Fkm7QrExn9ZElmrbrtV_9fcbIHKDBoyNg4TSZMw0_31KoEUSZsgJJvHX1QBHQqft3RjUSuq-DdiJ8VNQDkMOv4-uwTExrg0uJYF_G_rX6JBeawGfNCCPnCocFTlD87lWwACxq4Z0U97CvdEG8gvzKnOMInpm-rcf1tv3ufW4IuXSYa_acIoJec2GnC6_VaBvGt2_Yo8LF", date: "April 10, 2024", category: "Faculty", categoryColor: "text-sjcs-secondary", title: "Three SJCS Teachers Receive National Education Awards", excerpt: "Our faculty members were recognized for their outstanding contributions to Catholic education and innovative teaching methods." },
    { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz5EBKIbz4pc43-2e1pEj-XG55kGqkqTdfXMK-6Tpo1UOo87D8j4w9TDSWEhyFoeA44K8CeFFtKgkG324kFvOKaRxGiDb7bSiWLjfUgIN__hVPHDaW_guhZKw8QIdv2LKIdc7h8rYaboa-XCjzZywz5SoR9Q7q4zJCg1PxnZSQsmaeZz1aYThDWqdamKmca1XLvCukHMDs1ugcOGqMC0KmT5B9q_ZVMOlPCbe_hHVq-19crA4Qcn3ShJcmjPdpin_JPqMEEjGqUFS8", date: "March 22, 2024", category: "Athletics", categoryColor: "text-sjcs-primary", title: "Varsity Basketball Reaches State Semi-Finals", excerpt: "Coach Johnson's squad continued their historic run, bringing excitement and pride to the entire SJCS community." },
  ];

  return (
    <main>
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <Link to="/">Home</Link><span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">News &amp; Blog</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            SJCS <span className="text-sjcs-primary italic">News</span> &amp; Updates
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            Stay informed about the latest achievements, events, and stories from our school community.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((a) => (
              <div key={a.title} className="bg-sjcs-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${a.img}')` }}></div>
                <div className="p-8">
                  <div className="flex gap-4 text-xs font-bold text-sjcs-on-surface-variant/60 uppercase tracking-widest mb-4">
                    <span>{a.date}</span><span>•</span>
                    <span className={a.categoryColor}>{a.category}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-4 leading-snug">{a.title}</h3>
                  <p className="text-sjcs-on-surface-variant text-sm line-clamp-2 mb-6">{a.excerpt}</p>
                  <Link to="/news" className="font-bold text-sm underline decoration-sjcs-primary/30 hover:decoration-sjcs-primary transition-all">Read Story</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
