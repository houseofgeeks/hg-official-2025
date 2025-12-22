import React from "react";

const getDomainData = (slug: string) => {
  return {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    leads: ["Lead One", "Lead Two"],
    coordinators: ["Coordinator One", "Coordinator Two", "Coordinator Three"]
  };
};

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDomainData(slug);

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-32 px-4 pb-12">
      <div className="max-w-5xl w-full">
        <h1 className="text-8xl font-teko font-bold uppercase text-white mb-12">
          {data.title} <span className="text-[var(--themecolor)]">Domain</span>
        </h1>

        <div className="grid gap-12">
            <section>
                <h2 className="text-4xl font-teko text-[var(--themecolor)] mb-6">Leads</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.leads.map((lead, index) => (
                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white">{lead}</h3>
                            <p className="text-gray-400">Domain Lead</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-4xl font-teko text-[var(--themecolor)] mb-6">Coordinators</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.coordinators.map((coord, index) => (
                        <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white">{coord}</h3>
                            <p className="text-gray-400">Coordinator</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
