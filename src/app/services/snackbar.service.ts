import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackbar(message: string, state: string){
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: state
    });
  }
  
}
