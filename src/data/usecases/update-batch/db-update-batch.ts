import {
	IDbUpdateBatch,
	IUpdateAnimalModel,
	IUpdateBatchByIdRepository,
} from "./db-update-batch-protocols";

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
