import { Inject, Injectable, Logger } from "@nestjs/common";
import { MemberRepositoryToken, type MemberRepository } from "../ports/MemberRepository";
import Member from "src/member/domain/models/Member";
import { MemberNotFound } from "src/member/domain/errors/MemberNotFoundByDiscordId";
import { type LinkingCodeRepository, LinkingCodeRepositoryToken } from "../ports/LinkingCodeRepository";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MemberJoinedGuildEvent } from "src/member/domain/events/MemberJoinedGuildEvent";
import { InvalidLinkingCode } from "src/member/domain/errors/InvalidLinkingCode";
import { DiscordAccountAlreadyLinkedError } from "src/member/domain/errors/DiscordAccountAlreadyLinked";
import { MinecraftAccountAlreadyLinkedError } from "src/member/domain/errors/MinecraftAccountAlreadyLinked";

@Injectable()
export class MemberService {

    private static readonly log = new Logger(MemberService.name);

    constructor(
        @Inject(MemberRepositoryToken) private readonly memberRepository: MemberRepository,
        @Inject(LinkingCodeRepositoryToken) private readonly linkingCodeRepository: LinkingCodeRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async startAccountLinking(discordId: string, discordName: string): Promise<string> {
        let member = await this.memberRepository.findByDiscordId(discordId);

        if(!member) {
            member = Member.createNew(discordId, discordName);
        }

        if (member?.minecraftUuid) {
            throw new DiscordAccountAlreadyLinkedError(member.discordId, member.discordName);
        }

        await this.memberRepository.save(member);

        const existingLinkingCode = await this.linkingCodeRepository.findCodeByDiscordId(discordId);
        if(existingLinkingCode) {
            return existingLinkingCode;
        }

        return this.linkingCodeRepository.generateAndSaveCode(discordId);
    }

    async linkMinecraftAccount(linkingCode: string, minecraftUuid: string, minecraftName: string): Promise<void> {
        const discordId = await this.linkingCodeRepository.findDiscordIdByCode(linkingCode);

        if (!discordId) {
            throw new InvalidLinkingCode(linkingCode);
        }

        const existingMemberWithMinecraft = await this.memberRepository.findByMinecraftUuid(minecraftUuid);
        if (existingMemberWithMinecraft) {
            MemberService.log.warn(`INCONSISTENT DATA!!!: Attempt to link Minecraft account UUID ${minecraftUuid} (${minecraftName}) which is already linked to Discord ID ${existingMemberWithMinecraft.discordId}`);
            throw new MinecraftAccountAlreadyLinkedError(discordId, existingMemberWithMinecraft.discordId);
        }

        const member = await this.memberRepository.findByDiscordId(discordId);

        if (!member) {
            MemberService.log.error(`INCONSISTENT DATA!!!: Member not found for Discord ID: ${discordId}. This should not happen as we verified the linking code exists.`);
            throw new MemberNotFound(discordId);
        }

        member.linkMinecraftAccount(minecraftUuid, minecraftName);

        await this.memberRepository.save(member);
        await this.linkingCodeRepository.invalidateCode(linkingCode);
    }

    async joinGuild(discordId: string, guildId: string): Promise<void> {
        const member = await this.memberRepository.findByDiscordId(discordId);

        if (!member) throw new MemberNotFound(discordId);

        member.joinGuild(guildId);

        await this.memberRepository.save(member);
        this.eventEmitter.emit(MemberJoinedGuildEvent.eventName, new MemberJoinedGuildEvent(member.discordId, member.minecraftUuid!));
    }
}
