import { Inject } from "@nestjs/common";
import { MemberRepository } from "src/member/application/ports/MemberRepository";
import Member from "src/member/domain/models/Member";
import { PrismaService } from "src/prisma/PrismaService";

export class MemberRepositoryImpl implements MemberRepository {

    constructor(
        @Inject() private prisma: PrismaService
    ) {}

    async save(member: Member): Promise<void> {
        if(member.id === undefined) {
            await this.prisma.member.create({
                data: {
                    discordId: member.discordId,
                    discordName: member.discordName,
                    minecraftUuid: member.minecraftUuid,
                    minecraftName: member.minecraftName,
                    guildId: member.guildId,
                    guildJoinedAt: member.guildJoinedAt,
                    createdAt: new Date(),
                }
            });
        } else {
            await this.prisma.member.update({
                where: { id: member.id },
                data: {
                    discordId: member.discordId,
                    discordName: member.discordName,
                    minecraftUuid: member.minecraftUuid,
                    minecraftName: member.minecraftName,
                    guildId: member.guildId,
                    guildJoinedAt: member.guildJoinedAt,
                    updatedAt: new Date(),
                }
            });
        }
    }

    async findByDiscordId(discordId: string): Promise<Member | null> {
        const memberRecord = await this.prisma.member.findUnique({
            where: { discordId }
        });

        if (!memberRecord) {
            return null;
        }

        return new Member(
            memberRecord.id,
            memberRecord.discordId,
            memberRecord.discordName,
            memberRecord.minecraftUuid || undefined,
            memberRecord.minecraftName || undefined,
            memberRecord.guildId || undefined,
            memberRecord.guildJoinedAt || undefined
        );
    }

    async findByMinecraftUuid(minecraftUuid: string): Promise<Member | null> {
        const memberRecord = await this.prisma.member.findUnique({
            where: { minecraftUuid }
        });

        if (!memberRecord) {
            return null;
        }

        return new Member(
            memberRecord.id,
            memberRecord.discordId,
            memberRecord.discordName,
            memberRecord.minecraftUuid || undefined,
            memberRecord.minecraftName || undefined,
            memberRecord.guildId || undefined,
            memberRecord.guildJoinedAt || undefined
        );
    }
}