import { Container } from "inversify";
import TYPES from "../types";
import UserMapper from "../../mappers/UserMapper";
import ExpenseMapper from "../../mappers/ExpenseMapper";

export default class MapperInversify {
    public static register(container: Container) {
        container.bind<UserMapper>(TYPES.UserMapper).to(UserMapper);
        container.bind<ExpenseMapper>(TYPES.ExpenseMapper).to(ExpenseMapper);

    }
}
