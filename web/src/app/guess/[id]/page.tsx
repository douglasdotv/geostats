import { notFound } from 'next/navigation';
import { SingleGuessView } from '@/components/guesses/SingleGuessView';
import { getGuessById } from '@/app/actions';

interface SingleGuessPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default async function SingleGuessPage({
  params,
}: SingleGuessPageProps) {
  try {
    const awaitedParams = await params;
    const guess = await getGuessById(awaitedParams.id);

    if (!guess) {
      return notFound();
    }

    return (
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <SingleGuessView guess={guess} />
      </main>
    );
  } catch {
    return notFound();
  }
}
