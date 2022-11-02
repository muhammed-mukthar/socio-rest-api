

import bcrypt from "bcrypt";
import config from "config";




 const createHashedPass=async function (
    passwordInput: string
  ): Promise<string> {
      const salt = await bcrypt.genSalt(config.get<any>("saltlength"));
    const hash = await bcrypt.hashSync(passwordInput, salt);
    
      return hash
  };

  export default createHashedPass