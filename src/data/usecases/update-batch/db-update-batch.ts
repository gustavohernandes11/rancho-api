import { IUpdateBatchByIdRepository } from "@data/protocols/db/batch/update-batch-by-id-repository";
import { IDbUpdateBatch } from "@domain/usecases/batch/update-batch";
import { IUpdateAnimalModel } from "../update-animal/db-update-animal-protocols";

export class DbUpdateBatch implements IDbUpdateBatch {
	constructor(
		private readonly updateBatchByIdRepository: IUpdateBatchByIdRepository
	) {}
	async update(id: string, props: IUpdateAnimalModel): Promise<boolean> {
		const updated = await this.updateBatchByIdRepository.updateBatch(
			id,
			props
		);
		return !!updated;
	}
}
