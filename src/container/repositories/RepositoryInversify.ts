import { Container } from "inversify";
import TYPES from "../types";
import { UserRepository } from "../../repositories/UserRepository";

export default class RepositoryInversify {
  public static register(container: Container) {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
  }
}
