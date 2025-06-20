import { User } from "@prisma/client";
import { injectable } from "inversify";
import UserDto from "../dto/UserDto";

@injectable()
export default class UserMapper {
    constructor() { }

    public async toDto(document: User): Promise<UserDto> {

        return {
            id: document.id,
            name: document.name,
            email: document.email
        };
    }
}
