export class UserValidator {
  /**
   * 验证是否为有效用户名
   * @param name
   * @returns
   */
  public static isVaildName(name: string) {
    return name?.length > 0 && name?.length <= 30;
  }
  /**
   * 验证是否为有效邮箱
   * @param email
   * @returns
   */
  public static isEmail(email: string) {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
  }
  /**
   * 检查字符串是否是一个足够复杂的密码
   * 密码至少包含字母, 且长度为 7-64
   * @param password
   * @returns
   */
  public static isSecurePassword(password: string): boolean {
    return /^(?=.*[a-zA-Z]).{7,64}$/.test(password);
  }
}
