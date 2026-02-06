interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-2 items-start justify-start'>
      <h1 className='text-3xl'>
        Bem vindo ao <span className='font-semibold'>JustRun</span>
      </h1>
      <p className='text-muted-foreground text-sm md:text-base'>{label}</p>
    </div>
  );
};
