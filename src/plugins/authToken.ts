import { SERVER } from "../config";

import { Request, ResponseToolkit } from "@hapi/hapi";
import base64 from "base-64";


class authMiddleware {
    // basic auth verification 
  public basicAuth(request: Request, h: ResponseToolkit ) {
    const [username, password] = authMiddleware.decodeCredentials(
      request.headers.authorization || ""
    );
    if (
      username === SERVER.BASIC_AUTH.NAME &&
      password === SERVER.BASIC_AUTH.PASS
    ) {
      return h.continue;
    }

  }
  private static decodeCredentials(authHeader:any) {
    // authHeader: Basic YWRtaW46YWRtaW4=
    const encodedCredentials = authHeader.trim().replace(/Basic\s+/i, "");

    const decodedCredentials = base64.decode(encodedCredentials);
    return decodedCredentials.split(":");
  }
}

export const AuthMiddleware=new authMiddleware();


