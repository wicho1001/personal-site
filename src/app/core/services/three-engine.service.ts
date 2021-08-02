import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


@Injectable({providedIn: 'root'})
export class ThreeEngineService implements OnDestroy {

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private cube: THREE.Mesh;

  private frameId: number = null;
  loader = new GLTFLoader();
  model3D: any;


  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.camera.position.x = 1;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.PointLight( 0x404040, 1, 100 );
    this.light = new THREE.PointLight( 0x404040, 1, 100 );
    this.light.position.set(50, 50, 50)
    const light = new THREE.AmbientLight(0x404040, .5);
    light.position.z = 10;
    this.scene.add(this.light);
    this.scene.add(light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial();
    // this.cube = new THREE.Mesh(geometry, material);
    console.log(geometry)
    this.scene.add(this.cube);
    this.loader.load('/assets/models/wicho2.0.gltf', (gltf) => {
      this.model3D = gltf.scene;
      console.log(gltf)
      const light2 = new THREE.DirectionalLight(0x404040, 5, 1000);
      light2.target = gltf.scene;
      this.scene.add(light2);
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.log(error)
    })

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.model3D.rotation.x += 0.01;
    this.model3D.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}