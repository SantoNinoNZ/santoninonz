import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header";

const aboutSinulogContent = `
# About Sinulog
## Celebrations in New Zealand

For 26 years, New Zealanders of Philippine origins look forward to one of the most colourful festival in Auckland, the Sinulog NZ Festival. Celebrated every 3rd Sunday of January, the annual celebration is becoming one of the important display of Asian culture in New Zealand.

Sinulog NZ Festival is history presented in pageantry, dance and music like no other. It is a festival mirrored from one of the Philippines most colourful and most internationally renowned event.

Hosted by the Sto. Nino New Zealand Trust, the Sinulog NZ Festival is a cultural and historical account of a people’s conversion to Christianity. It is a story emanating from a village in the island of Cebu of the Central Philippines, a familiar trading post in the early days of civilisation in Southeast Asia. It was a culture built through the influences of other cultures in the Far East. It was a land with its own unique system of writing and alphabet. A land used to dealing with people from different lands. This is the land where a Portuguese explorer, Ferdinand Magellan, under the banner of Spain reportedly “discovered” in 1521.

Historical accounts from the Spanish archives tell the story of Magellan’s quest to teach the Christian faith in the newfound land. With the help of a native guide and interpreter, he was able to impart the basic tenets of the Gospel and converted one of the most powerful chieftains of Cebu, Rajah Humabon and his queen, Rajah Amihan together with the whole tribe. The image of the Holy Child Jesus was given to Rajah Amihan as a gift and became the remembrance of the dawn of Christianity in Southeast Asia. It became the symbol of a people’s faith and was attributed for the spread of the Christian faith to the rest of the islands, despite trials and opposition.

Sinulog literally translates as “flow of the river” and became a reference to the natives’ dance of celebration to honour their faith. Through time, Sinulog evolved into a graceful dance sequence re-telling the story of conversion & miracles attributed to the Holy Child Jesus, the historical account of a people’s faith and a brilliant way to preserve a country’s culture. It is a unique dance step movement to the accompaniment of the beating of the drums and the pageantry of colours.

From humble beginnings in Auckland, the Feast of the Holy Child Jesus and Sinulog Festival became an annual celebration that continues to attract New Zealanders of Philippine origins. The Year 2011 event attracted close to 6,000 people; with delegations coming from all over New Zealand. It is an event to reunite people with its culture & history. It is also a time for people to re-connect with each other and renew the bonds that ties.

Sinulog NZ Festival is an affirmation of Auckland’s ethnic diversity and New Zealand’s uniqueness.

## SOCIOLOGICAL IMPACT

Culture is a significant aspect of a person’s existence. It defines who he is and influences how he views the outside world.

In multi-cultural New Zealand, it is important that peoples of various cultures be able to contribute the best from where they came to an expanding Kiwi sociological sphere. Culture should not be a segregating structure. Rather, it should build bridges of understanding among humanity with a shared future. Appreciating the rich cultural diversity in New Zealand provide a strong platform for community spirit.

Sinulog NZ Festival aims to contribute to the expanding range of New Zealand ethnically diverse culture.

Sinulog NZ Festival has its roots from the Philippines, an archipelago of more than 7,000 islands in the Pacific. Being the only predominantly Christian country in Southeast Asia, the festival tells the story of the Spanish influence of the Philippines, the people’s conversion to Christianity and the significance of the Holy Child Jesus in the people’s heart. In most countries under Spanish rule in the past, religion permeates daily life. Hence, the Sinulog reflects a culture that celebrates a historical account

New Zealanders of Philippine origins number about 40,000; with close to 60% residing in the Auckland Region. They are part of the growing number of Asian communities that is humbly contributing to the rainbow of cultures in New Zealand. Excelling in various field of expertise – accounting, engineering, health care, hospitality and information technology, Filipinos, as they are ethnically identified, have made New Zealand their home by choice. Encouraged by the cultural diversity of the country, they are eager to share their culture through the Sinulog NZ Festival.

## COMMUNITY IMPACT

Sinulog NZ Festival is organised by the volunteers, banded as the Cultural Committee, of the Sto. Nino Zealand Trust. As such, they receive no compensation.

The community and family involvement is significant for the success of the event. The volunteers come from various parts of Auckland, including the North Shore, Manurewa, Henderson, Mt. Wellington, CBD, Blockhouse Bay, among others. They comprise families with children ages 5 to 18 years of age.

The volunteers are organised into the following teams:
Steering
Creative Concept
Stage Design and Sound System
Dance and Pageantry
Security and Safety

The responsibility of the teams follows:

The Steering Team consist of the senior volunteers with adequate experience in leadership, organisation and administration. They manage the different teams through a deliverables and timeline plan up to the event.

The Creative Concept Team consists of the dance choreographers with strong background in Philippine culture and the Sinulog Dance. They develop the dance sequences in line with the historical storyline and executing the overall theme developed by the Steering Committee.

The Stage Design and Sound System Team consist of volunteers with technical experience in enhancing sound and stage design to complement the dance choreography. They coordinate the structural requirement with the events venue and the details of the performance area.

The Security and Safety Team handles the security requirement of the premises and ensuring the safety of the whole event. They staff the parking area, lobby, VIP area, main stadium and participants holding area.

The Dance and Pageantry Team represents the actual cultural performers. The volunteers are organised into seven (7) major groups. A Segment Coordinator and a Choreographer lead each group. Each group performs a specific historical account interpreted through a dance sequence unique to the Sinulog.

The Sinulog NZ Festival has become an avenue for:

Community participation in socio-cultural activity. The event brings families together during the preparation and actual performance. Children learn the culture of their forefathers and will be able to discern their own cultural contribution to New Zealand.

Youth participation in self-development and team building. Young people channel their energies to a worthwhile objective, learn the value of teamwork, build on confidence in being part of a performance team and have fun with other young people.

Enhancement of creativity. Families and young people challenges their creativity in the preparation of their own costumes and learning new dance steps. Choreographers and artists find an outlet for their talents.

Contribution to Auckland economy. Modest contribution to the economy are ripple effects from process activities like the hiring of halls for the dance practices, the rental of the North Shore Events Centre, increased consumption of food, petrol and other utilities, the preparation of costumes and props sourced from local retailers and the travel & lodging accommodations of out-of-town New Zealanders.
`;

async function getProcessedContent() {
  const processedContent = await remark().use(html).process(aboutSinulogContent);
  return processedContent.toString();
}

const AboutSinulogPage = async () => {
  const contentHtml = await getProcessedContent();

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-md bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          About Sinulog
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
};

export default AboutSinulogPage;
