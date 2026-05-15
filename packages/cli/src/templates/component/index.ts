export const componentTemplate = `interface {{name}}Props {
  className?: string;
}

const {{name}} = ({ className = '' }: {{name}}Props) => {
  return (
    <div className={className}>
      {{name}} component
    </div>
  );
};

export default {{name}};
`;