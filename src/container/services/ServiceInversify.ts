import { Container } from "inversify";
import TYPES from "../types";
import UserAuthService from "../../services/UserAuthService";
import ExpenseService from "../../services/ExpenseService";

export default class ServiceInversify {
  public static register(container: Container) {
    container.bind<UserAuthService>(TYPES.UserAuthService).to(UserAuthService);
    container.bind<ExpenseService>(TYPES.ExpenseService).to(ExpenseService);

  }
}
