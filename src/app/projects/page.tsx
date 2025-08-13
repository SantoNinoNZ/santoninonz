import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header";

const projectsContent = `
# Projects

THE SHRINE & CHAPEL PROJECT

To build a Shrine and Chapel where we can practice our religious customs, culture and traditions and promote them to the younger generation.

PROJECT PLAN

The NZ – FILIPINO DEVOTEES OF SENYOR STO NIÑO TRUST will continue its fund raising activities so as to pursue the Project for a Shrine for Senyor Sto Nino which will have a Chapel for Perpetual Adoration and a Counselling Centre.

One of the ways you can show your support for the project is through joining The Co-operative Bank.

The Co-operative Bank and the NZ – Filipino Devotees of Senyor Sto Niño Trust has put together a special banking package for all devotees, friends and family members. To receive these great offers, all you need to do is mention the NZ-
Filipino Devotees of Senyor Sto Niño when you take out the products. To find your nearest branch click here .

The Co-operative Bank will make a donation to the Trust for loans taken out. The donations we receive from
the Bank will be used to build a shrine for Senyor Sto Niño.
`;

async function getProcessedContent() {
  const processedContent = await remark().use(html).process(projectsContent);
  return processedContent.toString();
}

const ProjectsPage = async () => {
  const contentHtml = await getProcessedContent();

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          Projects
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
};

export default ProjectsPage;
