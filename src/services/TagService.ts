import { injectable, inject } from "inversify";
import TYPES from "../container/types";
import { TagRepository } from "../repositories/TagRepository";

@injectable()
export default class TagService {

    constructor(
        @inject(TYPES.TagRepository) private tagRepository: TagRepository,
    ) { }

    public async getTagFrequencyMap(userId: number) {
        const tagFrequencies = await this.tagRepository.getUserTagsFrequency(userId)
        const tagsFrequencyMap = new Map<string, number>();
        for (const tag of tagFrequencies) {
            tagsFrequencyMap.set(tag.name, tag.count);
        }

        return tagsFrequencyMap
    }
}