// import styles from "./solutionBox.module.css";

// interface SolutionBoxProps {
//   title: string;
//   text: string;
// }

// export default function SolutionBox({ title, text }: SolutionBoxProps) {
//   return (
//     <div className={styles.solutionBoxComponent}>
//       <h3 className="text-xl">{title}</h3>
//       <p>{text}</p>
//     </div>
//   );
// }

import styles from "./solutionBox.module.css";

interface SolutionBoxProps {
  title: string;
  text: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function SolutionBox({ title, text, onMouseEnter, onMouseLeave }: SolutionBoxProps) {
  return (
    <div
      className={styles.solutionBoxComponent}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
