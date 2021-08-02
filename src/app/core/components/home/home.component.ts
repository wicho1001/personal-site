import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThreeEngineService } from '../../services/three-engine.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('rendererCanvas') rendererCanvas: ElementRef<HTMLCanvasElement>
  constructor(private three: ThreeEngineService) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(){
    this.three.createScene(this.rendererCanvas)
    this.three.animate()
  }

}
