import React from "react";

export default function SubmissionRules() {
  const ruleList = [
    "Remember the human",
    "Behave like you would in real life",
    "Look for the original source of content",
    "Search for duplicates before posting",
    "Read the community’s rules",
  ];
  return (
    <div className="bg-white rounded">
      <div className="p-3 rounded-t">
        <h3 className="flex p-4 border-b ">
          <img
            className="w-10 h-8 mr-2 align-bottom"
            src="https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/100/000000/external-animal-hunting-kiranshastry-gradient-kiranshastry.png"
          />
          Posting to Trendit
        </h3>
        <ol>
          {ruleList.map((rule, i) => {
            return (
              <li className="p-2 text-sm border-b" key={++i}>
                {`${++i}. ${rule}`}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
