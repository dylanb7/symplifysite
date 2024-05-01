import dayjs from "dayjs";

export const Footer: React.FC = () => {
  return (
    <footer className="px-1 py-12 text-center">
      &copy; {dayjs().format("YYYY")} Symplify LLC. All rights reserved.
    </footer>
  );
};

/*<style>
	footer {
		padding: 2em 1em 6em 1em;
		background: linear-gradient(var(--gray-gradient)) no-repeat;
		color: rgb(var(--gray));
		text-align: center;
	}
	
</style> */
