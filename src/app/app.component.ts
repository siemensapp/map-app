import { Component, OnInit,  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http/src/response';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'map-app';

  setColor(option) {
    switch(option) {
      case 'En Servicio':
        return '#FF7115';
      case 'Compensatorio':
        return '#008DFF';
      case 'Vacaciones':
        return '#FFE300';
      case 'Disponible':
        return '#06AA00';
      case 'Incapacidad':
        return '#BB0000';
      case 'Permiso':
        return '#5B00BB';
      case 'Capacitación':
        return '#8B8B8B';
      case 'Disponibilidad FDS':
        return '#A04B00';
    }    
  }
  
  
  constructor(private httpService: HttpClient){}
  Resultados : JSON[];
  ngOnInit(){
    this.httpService.get('http://aa7db7ec.ngrok.io/api/workersList').subscribe(
      data => {
        this.Resultados = data as JSON[];
      }
    )
  }
}
