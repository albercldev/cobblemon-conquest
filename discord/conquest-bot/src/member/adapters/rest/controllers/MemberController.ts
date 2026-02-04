import { Body, Controller, Logger, Post, Req } from "@nestjs/common";
import { MemberService } from "../../../application/services/MemberService";
import { LinkMinecraftAccountDto, StartAccountLinkingDto } from "../dtos/MemberDto";

@Controller('members')
export class MemberController {

    private static readonly logger = new Logger(MemberController.name);

    constructor(
        private readonly memberService: MemberService,
    ) { }

    @Post()
    async startAccountLinking(@Body() {discordId, discordName}: StartAccountLinkingDto): Promise<string> {
        MemberController.logger.log(`Starting account linking for Discord ID: ${discordId}, Discord Name: ${discordName}`);
        return this.memberService.startAccountLinking(
            discordId, 
            discordName
        );
    }

    @Post('/link')
    async linkAccount(@Body() {linkingCode, minecraftUuid, minecraftName}: LinkMinecraftAccountDto) {
        MemberController.logger.log(`Linking Minecraft account with UUID: ${minecraftUuid}, Minecraft Name: ${minecraftName} using Linking Code: ${linkingCode}`);
        return this.memberService.linkMinecraftAccount(
            linkingCode, 
            minecraftUuid,
            minecraftName
        );
    }
}