import { App } from "../../app";
import { StorageService } from "../../storage/service";

export class AnimePictureSerivce {
  private readonly prisma = App.instance.prisma;

  private getStorageService() {
    return App.instance.services.getService(StorageService);
  }

  async getPictureTempUrl(id: string): Promise<string | null> {
    const animePicture = await App.instance.prisma.animePicture.findUnique({
      where: { id },
      include: { file: true },
    });

    if (animePicture?.url) {
      return animePicture.url;
    }

    if (animePicture?.file) {
      const storageService = this.getStorageService();
      try {
        const tempUrl = await storageService.getFileTempUrl(animePicture.file);
        return tempUrl;
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  async getAnimePoster(
    animeId: number,
    smallFirst?: boolean
  ): Promise<string | null> {
    const anime = await this.prisma.anime.findUnique({
      where: { id: animeId },
      include: {
        posters: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!anime) return null;

    const animePicture = smallFirst
      ? anime.posters.find((poster) => poster.type === "SmallPoster") ??
        anime.posters.find((poster) => poster.type === "Poster") ??
        null
      : anime.posters.find((poster) => poster.type === "Poster") ??
        anime.posters.find((poster) => poster.type === "SmallPoster") ??
        null;

    if (!animePicture) return null;

    if (animePicture.url) {
      return animePicture.url;
    }
    if (animePicture.file) {
      try {
        return await this.getStorageService().getFileTempUrl(animePicture.file);
      } catch (error) {
        return null;
      }
    }

    return null;
  }
}
