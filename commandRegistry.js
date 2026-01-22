const {SlashCommandBuilder} = require("discord.js");
const commands = [
    new SlashCommandBuilder().setName('nsfw').setDescription('Search RedGifs for NSFW content')
        .addStringOption(o => o.setName('search').setDescription('What to search for').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('rule34').setDescription('Search Rule34')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('gelbooru').setDescription('Search Gelbooru')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('e621').setDescription('Search e621 (furry content)')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('realbooru').setDescription('Search Realbooru (real photos)')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('hypnohub').setDescription('Search HypnoHub for hypnosis-themed content')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (space separated, use - for exclude)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('yandere').setDescription('Search Yande.re (anime/hentai)')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('konachan').setDescription('Search Konachan (anime wallpapers)')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('danbooru').setDescription('Search Danbooru (anime/hentai)')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('random').setDescription('Get a random NSFW GIF')
        .addStringOption(o => o.setName('tag').setDescription('Optional tag/search or "favorite" to use your favorite').setRequired(false))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('trending').setDescription('Get a random trending NSFW GIF')
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('auto').setDescription('Auto-post random content every interval')
        .addIntegerOption(o => o.setName('interval').setDescription('Seconds between posts (owner: 30-300s, regular: 65-300s)').setRequired(true).setMinValue(30).setMaxValue(300))
        .addStringOption(o => o.setName('api').setDescription('Which API to use').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'RedGifs', value: 'redgifs' },
                { name: 'Rule34', value: 'rule34' },
                { name: 'Gelbooru', value: 'gelbooru' },
                { name: 'e621', value: 'e621' },
                { name: 'Realbooru', value: 'realbooru' },
                { name: 'HypnoHub', value: 'hypnohub' },
                { name: 'Yande.re', value: 'yandere' },
                { name: 'Konachan', value: 'konachan' },
                { name: 'Danbooru', value: 'danbooru' },
                { name: 'Xbooru', value: 'xbooru' },                    
                { name: 'Rule34Paheal', value: 'rule34paheal' },
                { name: 'ATFBooru', value: 'atfbooru' },
                { name: 'Behoimi', value: 'behoimi' },
                { name: 'Reddit', value: 'reddit' }
            ))
        .addStringOption(o => o.setName('tag').setDescription('Optional tag/search or "favorite" to use your favorites').setRequired(false))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('stop').setDescription('Stop auto-posting in this channel').setDMPermission(false),

    new SlashCommandBuilder().setName('status').setDescription('Show active auto-posts and bot statistics').setDMPermission(false),

    new SlashCommandBuilder().setName('favorite').setDescription('Manage your favorite tags')
        .addSubcommand(sub => sub.setName('add').setDescription('Add a favorite tag')
            .addStringOption(o => o.setName('tag').setDescription('Tag to add to favorites').setRequired(true)))
        .addSubcommand(sub => sub.setName('remove').setDescription('Remove a favorite tag')
            .addStringOption(o => o.setName('tag').setDescription('Tag to remove from favorites').setRequired(true)))
        .addSubcommand(sub => sub.setName('list').setDescription('List your favorite tags'))
        .addSubcommand(sub => sub.setName('clear').setDescription('Clear all your favorite tags'))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('blacklist').setDescription('Manage your personal tag blacklist')
        .addSubcommand(sub => sub.setName('add').setDescription('Add a tag to your blacklist')
            .addStringOption(o => o.setName('tag').setDescription('Tag to blacklist').setRequired(true)))
        .addSubcommand(sub => sub.setName('remove').setDescription('Remove a tag from your blacklist')
            .addStringOption(o => o.setName('tag').setDescription('Tag to remove from blacklist').setRequired(true)))
        .addSubcommand(sub => sub.setName('list').setDescription('List your blacklisted tags'))
        .addSubcommand(sub => sub.setName('clear').setDescription('Clear your entire blacklist'))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('admin').setDescription('Admin commands (owner only)')
        .addSubcommand(sub => sub.setName('blacklist-add').setDescription('Add a tag to global blacklist')
            .addStringOption(o => o.setName('tag').setDescription('Tag to globally blacklist').setRequired(true)))
        .addSubcommand(sub => sub.setName('blacklist-remove').setDescription('Remove a tag from global blacklist')
            .addStringOption(o => o.setName('tag').setDescription('Tag to remove from global blacklist').setRequired(true)))
        .addSubcommand(sub => sub.setName('blacklist-list').setDescription('List globally blacklisted tags'))
        .addSubcommand(sub => sub.setName('setlimit').setDescription('Set custom interval limit for a user')
            .addUserOption(o => o.setName('user').setDescription('User to set limit for').setRequired(true))
            .addIntegerOption(o => o.setName('interval').setDescription('Minimum interval in seconds').setRequired(true).setMinValue(30).setMaxValue(300)))
        .setDMPermission(false),
    new SlashCommandBuilder().setName('xbooru').setDescription('Search Xbooru')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('rule34paheal').setDescription('Search Rule34.paheal')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (space separated)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('atfbooru').setDescription('Search ATFBooru')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('behoimi').setDescription('Search Behoimi')
        .addStringOption(o => o.setName('tags').setDescription('Tags to search (comma-separated for multiple)').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),

    new SlashCommandBuilder().setName('reddit').setDescription('Search Reddit NSFW subreddits')
        .addStringOption(o => o.setName('subreddit').setDescription('Subreddit name (e.g., "nsfw" or "gonewild")').setRequired(false))
        .addStringOption(o => o.setName('type').setDescription('Filter by media type').setRequired(false)
            .addChoices(
                { name: 'Any', value: 'any' },
                { name: 'GIF Only', value: 'gif' },
                { name: 'Image Only', value: 'image' },
                { name: 'Video Only', value: 'video' }
            ))
        .setDMPermission(false),
].map(c => c.toJSON());

module.exports = { commands };