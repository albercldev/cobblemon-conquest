import { Module } from "@nestjs/common";
import { MemberService } from "./application/services/MemberService";
import { MemberRepositoryImpl as MemberRepositoryPrismaImpl } from "./adapters/database/repositories/MemberRepositoryImpl";
import { MemberController } from "./adapters/rest/controllers/MemberController";
import { MemberRepositoryToken } from "./application/ports/MemberRepository";
import { InMemoryLinkingCodeRepository as LinkingCodeRepositoryInMemoryImpl } from "./adapters/memory-database/InMemoryLinkingCodeRepository";
import { LinkingCodeRepositoryToken } from "./application/ports/LinkingCodeRepository";
import { MemberDiscordAdapter } from "./adapters/discord/MemberDiscordAdapter";

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [
        MemberService,
        MemberDiscordAdapter,
        {
            provide: MemberRepositoryToken,
            useClass: MemberRepositoryPrismaImpl,
        },
        {
            provide: LinkingCodeRepositoryToken,
            useClass: LinkingCodeRepositoryInMemoryImpl
        },
    ],
})
export class MemberModule { }