import { EmbedBuilder, Message } from "discord.js";
import { MessageCommand } from "../../types";
import normaliseWhiteSpace from "../../utils/normaliseWhiteSpace";
import axios from "axios";

const NUM_SEARCHES = 3;
const GOOGLE_PROCESS_STRING = " ... ";

const checkForQuestion: MessageCommand = async (message: Message) => {
    if (!message.content) return;

    const messageText = normaliseWhiteSpace(message.content);

    const regex = /(why|how) (do(es)|is)? ([^\.\?]+)[^\.\?]?$/i;
    const matches = messageText.match(regex);

    if (!matches || matches.index === undefined) return;

    const question = messageText.replaceAll("?", "%3F").replaceAll(" ", "+");
    

    // const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${question}&num=${NUM_SEARCHES}&start=1`;

    // // Use axios to get the json data from the custom google search api
    // const searchResults = (await axios.get(url)).data.items;
	const searchResults = testSearchResults;

    const processedSearchResults = new EmbedBuilder()
        .setTitle("Google Search")
        .setDescription(`Here are your search results for "${messageText}":`)
        .addFields(
            ...searchResults
                .map((result: any) => {
                    const index = result.snippet.indexOf(GOOGLE_PROCESS_STRING);
                    const [snippetDate, snippetContent] = [
                        result.snippet.substring(0, index).trim(),
                        result.snippet
                            .substring(index + GOOGLE_PROCESS_STRING.length)
                            .trim(),
                    ];

                    return {
                        name: `${snippetDate} - ${result.title}`,
                        value: `${snippetContent}\n${result.link}`,
                    };
                })
                .filter((field: any) => Boolean(field))
        ).data;

    if (processedSearchResults) {
        message.reply({ embeds: [processedSearchResults] });
    } else
        console.log(
            "Unable to send empty message for original message: ",
            message.content
        );
};

export default checkForQuestion;

// const reply = `https://letmegooglethat.com/?q=${question}`;

const testSearchResults = [
    {
        kind: "customsearch#result",
        title: "Micropenis: Causes, Symptoms, Diagnosis & Treatment",
        htmlTitle:
            "<b>Micropenis</b>: Causes, Symptoms, Diagnosis &amp; Treatment",
        link: "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        displayLink: "my.clevelandclinic.org",
        snippet:
            "Sep 6, 2022 ... Micropenis is an atypically small penis that's discovered in infancy or very early childhood. It's usually the result of a fetal ...",
        htmlSnippet:
            "Sep 6, 2022 <b>...</b> <b>Micropenis</b> is an atypically <b>small penis</b> that&#39;s discovered in infancy or <b>very</b> early childhood. It&#39;s usually the result of a fetal&nbsp;...",
        cacheId: "S8TrLHFaYpUJ",
        formattedUrl:
            "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        htmlFormattedUrl:
            "https://<b>my</b>.clevelandclinic.org/health/diseases/17955-micro<b>penis</b>",
        pagemap: {
            cse_thumbnail: [Array],
            metatags: [Array],
            cse_image: [Array],
        },
    },
    {
        kind: "customsearch#result",
        title: "Micropenis: Causes, Symptoms, Diagnosis & Treatment",
        htmlTitle:
            "<b>Micropenis</b>: Causes, Symptoms, Diagnosis &amp; Treatment",
        link: "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        displayLink: "my.clevelandclinic.org",
        snippet:
            "Sep 6, 2022 ... Micropenis is an atypically small penis that's discovered in infancy or very early childhood. It's usually the result of a fetal ...",
        htmlSnippet:
            "Sep 6, 2022 <b>...</b> <b>Micropenis</b> is an atypically <b>small penis</b> that&#39;s discovered in infancy or <b>very</b> early childhood. It&#39;s usually the result of a fetal&nbsp;...",
        cacheId: "S8TrLHFaYpUJ",
        formattedUrl:
            "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        htmlFormattedUrl:
            "https://<b>my</b>.clevelandclinic.org/health/diseases/17955-micro<b>penis</b>",
        pagemap: {
            cse_thumbnail: [Array],
            metatags: [Array],
            cse_image: [Array],
        },
    },
    {
        kind: "customsearch#result",
        title: "Micropenis: Causes, Symptoms, Diagnosis & Treatment",
        htmlTitle:
            "<b>Micropenis</b>: Causes, Symptoms, Diagnosis &amp; Treatment",
        link: "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        displayLink: "my.clevelandclinic.org",
        snippet:
            "Sep 6, 2022 ... Micropenis is an atypically small penis that's discovered in infancy or very early childhood. It's usually the result of a fetal ...",
        htmlSnippet:
            "Sep 6, 2022 <b>...</b> <b>Micropenis</b> is an atypically <b>small penis</b> that&#39;s discovered in infancy or <b>very</b> early childhood. It&#39;s usually the result of a fetal&nbsp;...",
        cacheId: "S8TrLHFaYpUJ",
        formattedUrl:
            "https://my.clevelandclinic.org/health/diseases/17955-micropenis",
        htmlFormattedUrl:
            "https://<b>my</b>.clevelandclinic.org/health/diseases/17955-micro<b>penis</b>",
        pagemap: {
            cse_thumbnail: [Array],
            metatags: [Array],
            cse_image: [Array],
        },
    },
];