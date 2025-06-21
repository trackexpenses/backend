import { User } from "@prisma/client";
import { injectable } from "inversify";
import UserDto from "../dto/UserDto";

@injectable()
export default class UserMapper {
    constructor() { }

    public toDto(document: User): UserDto {

        return {
            id: document.id,
            name: document.name,
            email: document.email
        };
    }
}
