import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { AnimeRequest, Anime, AnimeWithFilter } from 'structs/types/Anime';

import Config from 'config/Config';
import StringFormatter from 'AnimeThemes/StringFormatter';

export default class DiscordEmbed {

    public embedColor: ColorResolvable | null = [0, 0, 0];
    public initialDescription: string = '';
    public artists: string = '';

    /**
     * Set the color and initial description of the embed.
     * 
     * @param  {'added' | 'updated'}  type
     * @returns {DiscordEmbed}
     */
    setEmbedColor(type: 'added' | 'updated'): DiscordEmbed {
        this.embedColor = type === 'added' ? [46, 204, 113] : [255, 255, 0];
        this.initialDescription = type === 'added' ? `New video has been added.\n\n` : `A video has been updated.\n\n`;

        return this;
    }

    /**
     * Create the anime embed.
     * 
     * @param  {Anime | AnimeRequest}  animeInfo
     * @returns {EmbedBuilder}
     */
    getAnimeEmbed(animeInfo: Anime | AnimeRequest): EmbedBuilder {
        const description = `**Synopsis:** ${animeInfo.synopsis?.replace(/<br>/g, '')}\n\n**Link:** ${Config.ANIME_URL + '/' + animeInfo.slug}`

        return new EmbedBuilder()
            .setTitle(animeInfo.name)
            .setColor([154, 0, 255])
            .setDescription(description);
    }

    /**
     * Create an embed of a video using anime information.
     * 
     * @param  {AnimeWithFilter}  anime
     * 
     * @returns {EmbedBuilder}
     */
    createVideoEmbedByAnime(anime: AnimeWithFilter): EmbedBuilder {
        if (anime.song.artists.length !== 0) {
            this.initialDescription += new StringFormatter().artistsDescription(anime.song.artists) + '\n';
        }
        
        this.initialDescription += anime.spoiler ? '⚠️ Spoiler\n' : '';
        this.initialDescription += anime.nsfw ? '🔞 NSFW\n' : '';
        this.initialDescription +=  `**Episodes:** ${anime?.episodes === null || anime?.episodes.length === 0 ? '-' : anime?.episodes}\n`;
        this.initialDescription += new StringFormatter().videoDescription(anime);

        return new EmbedBuilder()
            .setColor(this.embedColor)
            .setTitle(`${anime?.theme_type}${anime?.version === null ? '' : `v${anime?.version}`}${anime?.song?.title === undefined ? '' : ` - ${anime.song.title ?? '*T.B.A.*'}`}`)
            .setDescription(this.initialDescription)
            .setThumbnail(anime.image as string);
    }
}