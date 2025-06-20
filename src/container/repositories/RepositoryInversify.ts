import { Container } from "inversify";
import TYPES from "../types";
import { UserRepository } from "../../repositories/UserRepository";
import { TagRepository } from "../../repositories/TagRepository";
import { ExpenseRepository } from "../../repositories/ExpenseRepository";
import { ExpenseTagRepository } from "../../repositories/ExpenseTagRepository";

export default class RepositoryInversify {
  public static register(container: Container) {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
    container.bind<TagRepository>(TYPES.TagRepository).to(TagRepository);
    container.bind<ExpenseRepository>(TYPES.ExpenseRepository).to(ExpenseRepository);
    container.bind<ExpenseTagRepository>(TYPES.ExpenseTagRepository).to(ExpenseTagRepository);
  }
}
