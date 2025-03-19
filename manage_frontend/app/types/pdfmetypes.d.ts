type TextType = {
  type: string;
  position: { x: number; y: number };
  content: string;
  width: number;
  height: number;
  rotate: number;
  alignment: string;
  verticalAlignment: string;
  fontSize: number;
  lineHeight: number;
  characterSpacing: number;
  fontColor: string;
  backgroundColor: string;
  opacity: number;
  readOnly: boolean;
  fontName: string;
  name: string;
};

type MultiVariableTextType = {
  type: string;
  position: { x: number; y: number };
  content: string;
  width: number;
  height: number;
  rotate: number;
  alignment: string;
  verticalAlignment: string;
  fontSize: number;
  lineHeight: number;
  characterSpacing: number;
  fontColor: string;
  backgroundColor: string;
  opacity: number;
  strikethrough: boolean;
  underline: boolean;
  variables: string[];
  readOnly: boolean;
  fontName: string;
  name: string;
};

type TableType = {
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  content: string;
  showHead: boolean;
  head: string[];
  headWidthPercentages: number[];
  fontName: string;
  tableStyles: { borderWidth: number; borderColor: string };
  headStyles: {
    fontName: string;
    fontSize: number;
    characterSpacing: number;
    alignment: string;
    verticalAlignment: string;
    lineHeight: number;
    fontColor: string;
    borderColor: string;
    backgroundColor: string;
    borderWidth: { top: number; right: number; bottom: number; left: number };
    padding: { top: number; right: number; bottom: number; left: number };
  };
  bodyStyles: {
    fontName: string;
    fontSize: number;
    characterSpacing: number;
    alignment: string;
    verticalAlignment: string;
    lineHeight: number;
    fontColor: string;
    borderColor: string;
    backgroundColor: string;
    alternateBackgroundColor: string;
    borderWidth: { top: number; right: number; bottom: number; left: number };
    padding: { top: number; right: number; bottom: number; left: number };
  };
  columnStyles: { alignment: { [key: string]: string } };
  name: string;
  readOnly: boolean;
};

type LineType = {
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  rotate: number;
  opacity: number;
  readOnly: boolean;
  color: string;
  name: string;
  content: string;
};

declare module "@pdfme/schemas" {
  const text: TextType;
  const multiVariableText: MultiVariableTextType;
  const table: TableType;
  const line: LineType;
}
