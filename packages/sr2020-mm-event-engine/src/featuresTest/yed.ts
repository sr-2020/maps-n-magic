import * as R from 'ramda';

export const yedGmlBase = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
xmlns:java="http://www.yworks.com/xml/yfiles-common/1.0/java"
xmlns:sys="http://www.yworks.com/xml/yfiles-common/markup/primitives/2.0"
xmlns:x="http://www.yworks.com/xml/yfiles-common/markup/2.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:y="http://www.yworks.com/xml/graphml"
xmlns:yed="http://www.yworks.com/xml/yed/3"
xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
<!--Created by yEd 3.15.0.2-->
<key attr.name="Description" attr.type="string" for="graph" id="d0"/>
<key for="port" id="d1" yfiles.type="portgraphics"/>
<key for="port" id="d2" yfiles.type="portgeometry"/>
<key for="port" id="d3" yfiles.type="portuserdata"/>
<key attr.name="url" attr.type="string" for="node" id="d4"/>
<key attr.name="description" attr.type="string" for="node" id="d5"/>
<key for="node" id="d6" yfiles.type="nodegraphics"/>
<key for="graphml" id="d7" yfiles.type="resources"/>
<key attr.name="url" attr.type="string" for="edge" id="d8"/>
<key attr.name="description" attr.type="string" for="edge" id="d9"/>
<key for="edge" id="d10" yfiles.type="edgegraphics"/>
<graph edgedefault="directed" id="G">
    <data key="d0"/>
    {0}
    {1}
</graph>
<data key="d7">
    <y:Resources/>
</data>
</graphml>`;

export const yedNodeTmpl = `<node id="{0}">
        <data key="d5"/>
        <data key="d6">
            <y:ShapeNode>
            <y:Geometry height="45.0" width="151.0" x="94.0" y="152.75"/>
            <y:Fill color="{2}" transparent="false"/>
            <y:BorderStyle color="{3}" type="line" width="1.0"/>
            <y:NodeLabel alignment="center" autoSizePolicy="content" fontFamily="Dialog"
            fontSize="12" fontStyle="plain" hasBackgroundColor="false" hasLineColor="false"
            height="18.701171875" modelName="custom" textColor="#000000" visible="true"
            width="35.8515625" x="57.57421875" y="13.1494140625">{1}<y:LabelModel>
                <y:SmartNodeLabelModel distance="4.0"/>
                </y:LabelModel>
                <y:ModelParameter>
                <y:SmartNodeLabelModelParameter labelRatioX="0.0" labelRatioY="0.0" nodeRatioX="0.0" nodeRatioY="0.0" offsetX="0.0" offsetY="0.0" upX="0.0" upY="-1.0"/>
                </y:ModelParameter>
            </y:NodeLabel>
            <y:Shape type="roundrectangle"/>
            </y:ShapeNode>
        </data>
        </node>`;

export const yedEdgeTmpl = `<edge id="{0}" source="{2}" target="{3}">
<data key="d9"/>
<data key="d10">
  <y:PolyLineEdge>
    <y:Path sx="72.0" sy="-0.0" tx="-72.0" ty="-0.0"/>
    <y:LineStyle color="#000000" type="line" width="1.0"/>
    <y:Arrows source="none" target="standard"/>
    <y:BendStyle smoothed="false"/>
    <y:EdgeLabel alignment="center" configuration="AutoFlippingLabel" distance="2.0" 
      fontFamily="Dialog" fontSize="12" fontStyle="plain" hasBackgroundColor="false" 
      hasLineColor="false" height="18.701171875" horizontalTextPosition="center" 
      iconTextGap="4" modelName="custom" preferredPlacement="anywhere" ratio="0.5" 
      textColor="#000000" verticalTextPosition="bottom" visible="true" width="23.341796875" 
      x="-0.0458984375" xml:space="preserve" y="20.6494140625">{1}<y:LabelModel>
      <y:SmartEdgeLabelModel autoRotationEnabled="false" defaultAngle="0.0" defaultDistance="10.0"/>
      </y:LabelModel><y:ModelParameter>
      <y:SmartEdgeLabelModelParameter angle="0.0" distance="30.0" distanceToCenter="true" 
      position="right" ratio="0.5" segment="0"/></y:ModelParameter><y:PreferredPlacementDescriptor 
      angle="0.0" angleOffsetOnRightSide="0" angleReference="absolute" angleRotationOnRightSide="co" 
      distance="-1.0" frozen="true" placement="anywhere" side="anywhere" sideReference="relative_to_edge_flow"/></y:EdgeLabel>
  </y:PolyLineEdge>
</data>
</edge>`;

export const yedEdgeTmpl2 = `<edge id="{0}" source="{2}" target="{3}">
        <data key="d9"/>
        <data key="d10">
            <y:ArcEdge>
            <y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0">
                <y:Point x="346.6875" y="333.375"/>
            </y:Path>
            <y:LineStyle color="#000000" type="line" width="1.0"/>
            <y:Arrows source="none" target="standard"/>
            <y:EdgeLabel alignment="center" configuration="AutoFlippingLabel" distance="2.0"
            fontFamily="Dialog" fontSize="12" fontStyle="plain" hasBackgroundColor="false"
            hasLineColor="false" height="18.701171875" modelName="custom"
            preferredPlacement="anywhere" ratio="0.5" textColor="#000000" visible="true"
            width="41.30078125" x="-234.82116743359467" y="-7.955110597360772">{1}<y:LabelModel>
                <y:SmartEdgeLabelModel autoRotationEnabled="false" defaultAngle="0.0" defaultDistance="10.0"/>
                </y:LabelModel>
                <y:ModelParameter>
                <y:SmartEdgeLabelModelParameter angle="0.0" distance="30.0" distanceToCenter="true" position="center" ratio="0.189477660359121" segment="-1"/>
                </y:ModelParameter>
                <y:PreferredPlacementDescriptor angle="0.0" angleOffsetOnRightSide="0"
                angleReference="absolute" angleRotationOnRightSide="co" distance="-1.0"
                frozen="true" placement="anywhere" side="anywhere" sideReference="relative_to_edge_flow"/>
            </y:EdgeLabel>
            <y:Arc height="106.20632934570312" ratio="1.0" type="fixedRatio"/>
            </y:ArcEdge>
        </data>
        </edge>`;



export const strFormat = R.curry((str, vals) => str.replace(/\{\{|\}\}|\{(\d+)\}/g, (m, n) => {
    if (m === '{{') { return '{'; }
    if (m === '}}') { return '}'; }
    return vals[n];
}));


export const colorPalette = [
  {
      color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: { border: '#2B7CE9', background: '#D2E5FF' },
          hover: { border: '#2B7CE9', background: '#D2E5FF' }
      }
  }, // 0: blue
  {
      color: {
          border: '#FFA500',
          background: '#FFFF00',
          highlight: { border: '#FFA500', background: '#FFFFA3' },
          hover: { border: '#FFA500', background: '#FFFFA3' }
      }
  }, // 1: yellow
  {
      color: {
          border: '#FA0A10', background: '#FB7E81', highlight: { border: '#FA0A10', background: '#FFAFB1' }, hover: { border: '#FA0A10', background: '#FFAFB1' }
      }
  }, // 2: red
  {
      color: {
          border: '#41A906', background: '#7BE141', highlight: { border: '#41A906', background: '#A1EC76' }, hover: { border: '#41A906', background: '#A1EC76' }
      }
  }, // 3: green
  {
      color: {
          border: '#E129F0', background: '#EB7DF4', highlight: { border: '#E129F0', background: '#F0B3F5' }, hover: { border: '#E129F0', background: '#F0B3F5' }
      }
  }, // 4: magenta
  {
      color: {
          border: '#7C29F0', background: '#AD85E4', highlight: { border: '#7C29F0', background: '#D3BDF0' }, hover: { border: '#7C29F0', background: '#D3BDF0' }
      }
  }, // 5: purple
  {
      color: {
          border: '#C37F00', background: '#FFA807', highlight: { border: '#C37F00', background: '#FFCA66' }, hover: { border: '#C37F00', background: '#FFCA66' }
      }
  }, // 6: orange
  {
      color: {
          border: '#4220FB', background: '#6E6EFD', highlight: { border: '#4220FB', background: '#9B9BFD' }, hover: { border: '#4220FB', background: '#9B9BFD' }
      }
  }, // 7: darkblue
  {
      color: {
          border: '#FD5A77', background: '#FFC0CB', highlight: { border: '#FD5A77', background: '#FFD1D9' }, hover: { border: '#FD5A77', background: '#FFD1D9' }
      }
  }, // 8: pink
  {
      color: {
          border: '#4AD63A', background: '#C2FABC', highlight: { border: '#4AD63A', background: '#E6FFE3' }, hover: { border: '#4AD63A', background: '#E6FFE3' }
      }
  }, // 9: mint

  {
      color: {
          border: '#990000', background: '#EE0000', highlight: { border: '#BB0000', background: '#FF3333' }, hover: { border: '#BB0000', background: '#FF3333' }
      }
  }, // 10:bright red

  {
      color: {
          border: '#FF6000', background: '#FF6000', highlight: { border: '#FF6000', background: '#FF6000' }, hover: { border: '#FF6000', background: '#FF6000' }
      }
  }, // 12: real orange
  {
      color: {
          border: '#97C2FC', background: '#2B7CE9', highlight: { border: '#D2E5FF', background: '#2B7CE9' }, hover: { border: '#D2E5FF', background: '#2B7CE9' }
      }
  }, // 13: blue
  {
      color: {
          border: '#399605', background: '#255C03', highlight: { border: '#399605', background: '#255C03' }, hover: { border: '#399605', background: '#255C03' }
      }
  }, // 14: green
  {
      color: {
          border: '#B70054', background: '#FF007E', highlight: { border: '#B70054', background: '#FF007E' }, hover: { border: '#B70054', background: '#FF007E' }
      }
  }, // 15: magenta
  {
      color: {
          border: '#AD85E4', background: '#7C29F0', highlight: { border: '#D3BDF0', background: '#7C29F0' }, hover: { border: '#D3BDF0', background: '#7C29F0' }
      }
  }, // 16: purple
  {
      color: {
          border: '#4557FA', background: '#000EA1', highlight: { border: '#6E6EFD', background: '#000EA1' }, hover: { border: '#6E6EFD', background: '#000EA1' }
      }
  }, // 17: darkblue
  {
      color: {
          border: '#FFC0CB', background: '#FD5A77', highlight: { border: '#FFD1D9', background: '#FD5A77' }, hover: { border: '#FFD1D9', background: '#FD5A77' }
      }
  }, // 18: pink
  {
      color: {
          border: '#C2FABC', background: '#74D66A', highlight: { border: '#E6FFE3', background: '#74D66A' }, hover: { border: '#E6FFE3', background: '#74D66A' }
      }
  }, // 19: mint

  {
      color: {
          border: '#EE0000', background: '#990000', highlight: { border: '#FF3333', background: '#BB0000' }, hover: { border: '#FF3333', background: '#BB0000' }
      }
  } // 20:bright red
];