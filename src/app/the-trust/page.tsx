import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header";
import Image from 'next/image';

const mainTrustContent = `
# The Trust
The NZ – FILIPINO STO NINO DEVOTEES TRUST was founded on 2nd February 1996 as a charitable trust incorporated under the Charitable Trusts Act 1957. It has Donee and Legal Charity status.

The objectives of the Trust are:
To promote & enhance the devotion, organize and encourage the adoration and veneration to the Holy Child Jesus, Senor Santo Nino thru:
* weekly religious service
* weekly house to house visitation
* promoting religious activities/devotion
* organize the provision for the annual religious fiesta celebration

To create Community awareness and understanding of Filipino Culture and tradition:
* By organizing seminars, talks and documentaries on Philippine History, culture & traditions
* By organizing coaching sessions on conversational Philippine language (Tagalog) to retain cultural understanding of language
* By organizing Sinulog Dance competitions
* By organizing Queen of Festivity competitions
* By teaching cultural dances & traditions, especially to the youth

To maintain an ongoing support and assistance to New & Existing migrants in their settlement in New Zealand, Addressing the risk of isolation:
* By promoting & encouraging support groups thru networking
* By engaging a community access radio program to carry out information on various settlement and relevant day to day issues that may have an impact on migrants
* By publishing a quarterly newsletter highlighting current News and activities in the communities, important tips to migrants and knowledge sharing

To organize youth development programs that will help enhance youth skills & abilities and promote awareness of preventive Approach to diverse influences
Enhance youth skills in music and arts thru:
* Hip-hop dance training sesssion
* Break dance training sessions
* Drum-line training sessions
* Involvement in Choral groups, theater and musical bands
* Learning cultural & traditional dances and songs

Organize youth sports & recreation activities and Organize Life skills seminars/events for all Filipino migrants
* cookery lessons
* Pastry & Baking lessons
* Street Basketball
* School holiday programs
`;

const trusteesData = [
  { name: "Miriam Batucan", imageName: "MiriamBatucan", profile: `Miriam Batucan is the founding chairman of the NZ-Filipino Sto Nino Devotees Trust in 1994 and prime mover of Sinulog NZ activities since 1994. An accountant by profession. Have worked with big multi-national companies here in New Zealand for the past 26 years. Founder of NZ-Filipinos Sto Nino Devotees Trust and Sinulog NZ. Recipient of an Award from Pope Benedict VI, the Benemerenti Medal. Recipient of an award in Clinical Pastoral Education. Very much involved in Pastoral care among Filipinos and non-Filipinos in various communities especially with the young people, couples and families.

Her Message : All Glory and Praise to God for giving us the opportunity to help spread the devotions to Senor Santo Nino here in Auckland New Zealand.

Thank you to all devotees and community groups who have worked hand in hand with us in making alive the devotions to Senor Santo Nino here in this beautiful part of the world, Aotearoa New Zealand.

25 years of faithful devotions to our beloved Senor Santo Nino is a great blessing for us all. Let us keep the devotions going and pass them on to the next generations.

Viva Senor Santo Nino! Pit Senor!

Email Batucan@xtra.co.nz` },
  { name: "Oscar Batucan", imageName: "OscarBatucan", profile: `Oscar Batucan answers the call for a true Servant Leader. He relentlessly promotes community service. He has a reputation of a good communicator, a team builder, idea generator, problem solver. He is a person of professional and personal integrity.

Oscar is a graduate of Bachelor in Commerce.

Highlights of his work and community service include:

* Senior Executive Officer, DSW South Auckland District
* District Manager IRD, Child Support Agency South Auckland
* Case Manager, Ministry of Social Development, WINZ
* Justice of the Peace since 1994
* Project Development Manager
* Job placement and Consultancy – Employment, Education and Enterprise
* Recipient of an Award from Pope Benedict VI, the Benemerenti Medal
* Involvement in youth development and migrant advocacy` },
  { name: "Mary Anne Batucan", imageName: "MaryAnneBatucan", profile: `Mary Anne Batucan is currently working as a senior software analyst for Trustwave Inc. Anne, as she is known to her friends and family, has 12 years experience in IT in the telecommunications, airline, healthcare, email and web security industries. As well as a having a full time job Anne is also a managing director of a property investment company and director of a software development company.

She has been actively involved in the Trust’s activities since its inception and is currently the secretary for the trust` },
  { name: "Joyce Gesta", imageName: "JoyceGesta", profile: `Joyce Gesta graduated Bachelor of Science in Commerce, Accounting. Been with Cooperative Bank (formerly PSIS) since 1988. Currently branch manager, Onehunga Branch since 2005 but have had manager roles since 1993.` },
  { name: "Jocelynn Caballero", imageName: "JoyCaballero", profile: `Joy Caballero is a versatile results-oriented professional with more than 20 years IT experience in the energy, telecommunications, banking and finance, insurance, gaming, dairy, transport, healthcare solutions and software consultancy industries from programme/project management, softwaretesting, quality assurance, business analysis, training, implementation/release management, change management, documentation and supporting systems using leadership, business, communications, interpersonal, analytical, and organizational skills.

Trustee of Sto. Nino Trust since 1994 and Senior Organiser of Sinulog Festival (Annual Philippine Religious and Cultural Festival; between 5,000-6,000 attendees-audience base)` },
  { name: "Ma Consuelo ‘Chichi’ Abadingo", imageName: "ChichiAbadingo", profile: `Maria Consuelo “Chichi” Abadingo coordinates the community and choir groups involved in the yearly 9 days Novena as part of her Liturgical Committee duty. She administers the Sinulog NZ Social Media pages as well as maintains the website with updates on all activities of the Trust.
She has over 20 years of work experience in business software development. When she is not doing geek work as an ERP Business Analyst, she attends fitness classes, and is Deputy Chair of the Holy Cross Papatoetoe Parish Liturgy Committee.` },
  { name: "Bebeth Cutten", imageName: "BebethCutten", profile: `Bebeth Cutten is a long time Trustee. She actively promotes and supports all projects of the Trust most specially the annual grand Sinulog festival.` },
  // Trustees without images
  { name: "Maria Victoria Villaraza", profile: `` },
  { name: "Mila Rigby", profile: `` },
  { name: "Prescilla Suerto", profile: `` },
  { name: "JC Caballero", profile: `` },
  { name: "Erwin Lackar", profile: `` },
  { name: "Marilyn Lackar", profile: `` },
  { name: "Christine Repizo", profile: `` },
  { name: "Rexy Jose", profile: `` },
  { name: "Cathy Taypin Tomaquin", profile: `` },
];

async function getProcessedContent(content: string) {
  const processedContent = await remark().use(html).process(content);
  return processedContent.toString();
}

const TheTrustPage = async () => {
  const mainContentHtml = await getProcessedContent(mainTrustContent);

  const processedTrustees = await Promise.all(
    trusteesData.map(async (trustee) => ({
      ...trustee,
      profileHtml: trustee.profile ? await getProcessedContent(trustee.profile) : '',
    }))
  );

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          The Trust
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: mainContentHtml }}
        />

        <h2 className="text-3xl md:text-4xl font-lora font-bold mt-8 mb-4 text-[#2B1E1A] leading-tight">
          Board of Trustees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedTrustees.map((trustee, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm">
              {trustee.name && (
                <Image
                  src={`/assets/images/the-trust/${trustee.imageName || trustee.name.replace(/[^a-zA-Z0-9]/g, '')}.webp`}
                  alt={trustee.name}
                  width={150}
                  height={150}
                  className="rounded-full object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-lora font-semibold text-[#2B1E1A] mb-2">{trustee.name}</h3>
              {trustee.profileHtml && (
                <div
                  className="prose prose-sm max-w-none text-[#2B1E1A] font-roboto text-left"
                  dangerouslySetInnerHTML={{ __html: trustee.profileHtml }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TheTrustPage;
