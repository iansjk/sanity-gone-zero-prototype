import { css, Theme } from "@emotion/react";
import { transparentize } from "polished";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  header: string;
  subheader?: string;
};

const Card: React.FC<CardProps> = (props) => {
  const { header, subheader, children, ...rest } = props;
  return (
    <section css={styles} {...rest}>
      <div className="heading-block">
        <h2>{header}</h2>
      </div>
      <div className="card-content">{children}</div>
    </section>
  );
};
export default Card;

const styles = (theme: Theme) => css`
  background: ${transparentize(0.66, theme.palette.mid)};
  border-radius: ${theme.spacing(1)};
  padding: 0;

  .heading-block {
    padding: 16px 0 16px 24px;
    border-bottom: 1px solid ${theme.palette.midHighlight};
    background: ${transparentize(0.66, theme.palette.background)};
    backdrop-filter: blur(8px);

    h2 {
      margin: 0;
      text-transform: ${theme.typography.cardHeading.textTransform};
      font-size: ${theme.typography.cardHeading.size};
      font-weight: ${theme.typography.cardHeading.weight};
      letter-spacing: 1px;
      color: ${theme.palette.white};
    }
  }

  .card-content {
    padding: ${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(4)};
    backdrop-filter: blur(8px);

    & > p {
      margin: ${theme.spacing(3)} 0 0;
    }
  }
`;
