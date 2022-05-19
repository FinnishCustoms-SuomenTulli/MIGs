<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" encoding="utf-8" indent="yes"/>
	<xsl:template match="/Message">
		<xsl:copy>
			<xsl:apply-templates select="DataGroup"/>
			<xsl:apply-templates select="document('../GuaranteeQuery/common/resp.xml')/Message/DataGroup"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="Use"/>
	<xsl:template match="DescriptionLine"/>
	<xsl:template match="Format"/>
	<xsl:template match="Rule"/>
	<xsl:template match="Condition"/>
	<xsl:template match="Codelist"/>
	<xsl:template match="Hyperlink"/>
	<!--xsl:template match="DataGroup/XPath">
		<XPath>
			<xsl:value-of select="."/>
		</XPath>
		<Group>
			<xsl:value-of select="."/>
		</Group>
	</xsl:template-->
</xsl:stylesheet>