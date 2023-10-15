import PocketBase, { RecordModel } from "pocketbase";

const pocketbase = new PocketBase("https://pocketbase.emochoice.ca");

export default pocketbase;

export async function getGallery(name: string): Promise<string[]> {
  const result = await pocketbase
    .collection("gallery")
    .getOne<{ pictures: string[] } & RecordModel>("gallery", {
      filter: `name = ${name}`,
    });

  const images = result.pictures.map((picture) =>
    pocketbase.getFileUrl(result, picture)
  );

  return images;
}
