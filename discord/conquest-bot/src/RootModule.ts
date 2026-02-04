import { Module } from "@nestjs/common";
import { MemberModule } from "./member/MemberModule";
import { PrismaModule } from "./prisma/PrismaModule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { DiscordBotUpdates } from "./DiscordBotUpdates";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        PrismaModule.forRoot(),
        MemberModule,
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        NecordModule.forRoot({
            token: process.env.DISCORD_BOT_TOKEN || '',
            intents: [
                IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.DirectMessages
            ],
            development: process.env.DISCORD_DEVELOPMENT_GUILD_ID ? [process.env.DISCORD_DEVELOPMENT_GUILD_ID] : false,
            skipRegistration: false,
        })
    ],
    controllers: [],
    providers: [DiscordBotUpdates],
})
export class RootModule { }