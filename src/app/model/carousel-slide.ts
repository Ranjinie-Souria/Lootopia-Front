/**
 * La classe CarouselSlide représente un élément (slide) dans un carousel.
 *
 * @param id - L'identifiant unique de la slide.
 * @param title - Le titre de la slide.
 * @param description - La description de la slide.
 * @param image - Le nom de l'image à afficher dans la slide (facultatif mais va tout casser si on le met pas).
 * @param linkUrl - L'URL vers laquelle la slide redirige (facultatif).
 *
 * @remarks L'URL de l'image est construite en utilisant le chemin du dossier des assets du carousel et le nom de l'image fourni.
 */
export class CarouselSlide {
  id: number;
  title: string;
  description: string;
  image?: string;
  linkUrl?: string;

  constructor(
    id: number,
    title: string,
    description: string,
    image?: string,
    linkUrl?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = `/assets/images/carousel-img/${image}`;
    this.linkUrl = linkUrl;
  }
}
