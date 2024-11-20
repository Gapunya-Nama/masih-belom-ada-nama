import { subcategories } from './data/subcategories';
import SubCategoryUser from './components/SubCategoryUser';
import SubCategoryWorker from './components/SubCategoryWorker';
import { use } from 'react';

export function generateStaticParams() {
  return subcategories.map((subcategory) => ({
    id: subcategory.id,
  }));
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: 'worker' | 'user' }>;
}

export default function SubCategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);
  const subcategory = subcategories.find((s) => s.id === params.id);
  const isWorkerView = searchParams.view === 'worker';

  if (!subcategory) {
    return <div>Subkategori tidak ditemukan</div>;
  }

  return isWorkerView ? (
    <div className="pt-16">
      <SubCategoryWorker subcategory={subcategory} />
    </div>
  ) : (
    <div className="pt-16">
      <SubCategoryUser subcategory={subcategory} />
    </div>
  );
}