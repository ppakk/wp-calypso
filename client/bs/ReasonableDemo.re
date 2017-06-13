let component = ReasonReact.statelessComponent "ReasonableDemo";

let make ::name _children => {
  ...component,
  render: fun () _self =>
  	<div>
  		(ReasonReact.stringToElement name)
	</div>
};

let comp =
  ReasonReact.wrapReasonForJs
    ::component
    (fun jsProps => make name::jsProps##name [||]);
