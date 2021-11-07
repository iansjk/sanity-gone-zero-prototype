import React, { useState } from "react";
import { graphql } from "gatsby";
import { rgba } from "polished";
import slugify from "@sindresorhus/slugify";
import { css } from "@emotion/react";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
} from "@mui/material";

import Layout from "../Layout";
import { operatorClassIcon, operatorSubclassIcon } from "../utils/images";

interface Props {
  data: {
    allContentfulOperatorClass: {
      nodes: {
        className: string;
      }[];
    };
    allContentfulOperatorSubclass: {
      nodes: {
        subclass: string;
        subProfessionId: string;
      }[];
    };
  };
}

const Classes: React.VFC<Props> = ({ data }) => {
  const { nodes: operatorClasses } = data.allContentfulOperatorClass;
  const { nodes: operatorSubclasses } = data.allContentfulOperatorSubclass;
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [isSubclassMenuOpen, setIsSubclassMenuOpen] = useState(false);

  const handleClassClick: React.MouseEventHandler = (e) => {
    setIsClassMenuOpen(false);
  };

  const handleSubclassClick: React.MouseEventHandler = (e) => {
    setIsSubclassMenuOpen(false);
  };

  return (
    <Layout pageTitle="Classes and Subclasses">
      <main css={styles}>
        <div className="class-subclass-select">
          <label aria-hidden="true">Select</label>
          <Button
            variant="contained"
            aria-label="Select class"
            onClick={() => setIsClassMenuOpen(true)}
          >
            Class
          </Button>
          <Menu
            id="class-menu"
            open={isClassMenuOpen}
            onClose={() => setIsClassMenuOpen(false)}
          >
            {operatorClasses.map(({ className }) => (
              <MenuItem key={className} onClick={handleClassClick}>
                <ListItemIcon>
                  <img src={operatorClassIcon(slugify(className))} alt="" />
                </ListItemIcon>
                <ListItemText>{className}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="contained"
            aria-label="Select subclass"
            onClick={() => setIsSubclassMenuOpen(true)}
          >
            Subclass
          </Button>
          <Menu
            id="subclass-menu"
            open={isSubclassMenuOpen}
            onClose={() => setIsSubclassMenuOpen(false)}
          >
            {operatorSubclasses.map(({ subclass, subProfessionId }) => (
              <MenuItem key={subclass} onClick={handleSubclassClick}>
                <ListItemIcon>
                  <img src={operatorSubclassIcon(subProfessionId)} alt="" />
                </ListItemIcon>
                <ListItemText>{subclass}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className="results">
          <div className="select-class-message">Select operator class</div>
          <div className="select-subclass-message">
            Select operator subclass
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default Classes;

const styles = (theme: Theme) => css`
  margin: ${theme.spacing(4, 0, 0)};
  display: flex;
  flex-direction: column;
  border-radius: ${theme.spacing(1)};
  background-color: ${rgba(theme.palette.midtone.main, 0.66)};

  .class-subclass-select,
  .results {
    padding: ${theme.spacing(3, 4, 2)};
  }

  .class-subclass-select {
    border-bottom: 1px solid ${theme.palette.midtoneBrighterer.main};
  }

  .results {
    .select-class-message,
    .select-subclass-message {
      display: flex;
      width: 100%;
      padding: ${theme.spacing(2, 0)};
      justify-content: center;
      align-items: center;
      color: ${theme.palette.gray.main};
    }

    .select-class-message {
      background-color: ${theme.palette.midtone.main};
    }

    .select-subclass-message {
      background-color: ${theme.palette.midtoneDarker.main};
    }
  }
`;

export const query = graphql`
  query {
    allContentfulOperatorClass {
      nodes {
        className
      }
    }
    allContentfulOperatorSubclass {
      nodes {
        subclass
        subProfessionId
      }
    }
  }
`;
