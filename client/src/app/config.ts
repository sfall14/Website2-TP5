import { HttpHeaders } from '@angular/common/http';

/**
 * Defines some configurations for the application.
 */
export class Config {

  /**
   * The base API URL.
   */
  public static apiUrl = 'http://localhost:3000/api';

  public static options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true };
}