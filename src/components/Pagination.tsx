type Props = {
  page: number;
  limit: number;
  total: number;
  onPage: (p: number) => void;
};

export default function Pagination({ page, limit, total, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-between mt-4">
      <button className="btn btn-sm" onClick={prev} disabled={page <= 1}>
        Prev
      </button>
      <span className="text-sm">
        Page <b>{page}</b> of <b>{totalPages}</b> — Items: <b>{total}</b>
      </span>
      <button className="btn btn-sm" onClick={next} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
