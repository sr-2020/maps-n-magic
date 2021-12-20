export const eeSchemaEdgeTmpl = `<edge id="{0}" source="{2}" target="{3}">
<data key="d9"/>
<data key="d10">
  <y:PolyLineEdge>
    <y:Path sx="72.0" sy="-0.0" tx="-72.0" ty="-0.0"/>
    <y:LineStyle color="#000000" type="{4}" width="2.0"/>
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