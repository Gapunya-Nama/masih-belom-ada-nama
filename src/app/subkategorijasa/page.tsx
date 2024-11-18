import { subcategories } from './data/subcategories';
import SubCategoryUser from './components/SubCategoryUser';
import SubCategoryWorker from './components/SubCategoryWorker';

export function generateStaticParams() {
  return subcategories.map((subcategory) => ({
    id: subcategory.id,
  }));
}

interface Props {
  params: { id: string };
  searchParams: { view?: 'worker' | 'user' };
}

export default function SubCategoryPage({ params, searchParams }: Props) {
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