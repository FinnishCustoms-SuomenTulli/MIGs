<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:math="http://www.w3.org/2005/xpath-functions/math" xmlns:map="http://www.w3.org/2005/xpath-functions/map" xmlns:array="http://www.w3.org/2005/xpath-functions/array" exclude-result-prefixes="#all" version="3.0">
	<xsl:output method="text"/>
	<xsl:param name="language"/>
	<xsl:param name="system"/>
	<xsl:template match="/">
		<xsl:text>Graph </xsl:text>
		<xsl:value-of select="$system"/>
		<xsl:text> {&#xa;</xsl:text>
		<xsl:text>	node [shape=plaintext, fontname = "helvetica"];&#xa;</xsl:text>
		<xsl:text>	edge [fontname = "helvetica"];&#xa;</xsl:text>
		<xsl:for-each-group select="descendant::DataGroup" group-by="Group">
			<xsl:text>	"</xsl:text>
			<xsl:value-of select="Group"/>
			<xsl:text>" [label=&lt;&lt;table border="0" cellspacing="0" cellborder="1" color="#E3E5E9"&gt;&lt;tr&gt;&lt;td bgcolor="#00205B"&gt;&lt;font color="white"&gt;&lt;b&gt;</xsl:text>
			<xsl:choose>
				<xsl:when test="XPath='Communication' and $language='fi'">
					<xsl:text>Yhteystiedot</xsl:text>
				</xsl:when>
				<xsl:when test="XPath='Communication' and $language='sv'">
					<xsl:text>Kontaktuppgifter</xsl:text>
				</xsl:when>
				<xsl:when test="XPath='Communication' and $language='en'">
					<xsl:text>Contact information</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="Name[@lang=$language]"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:text>&lt;/b&gt;&lt;/font&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td bgcolor="#fafafa" align="left"&gt;</xsl:text>
			<xsl:for-each-group select="current-group()/DataElement" group-by="Name[@lang=$language]">
				<xsl:if test="Name[@lang='fi']!='Viestintätapa' and Name[@lang='fi']!='Luokitustyyppi' and Name[@lang='fi']!='Alkuperämaan tyyppi'">
					<xsl:value-of select="Name[@lang=$language]"/>
					<xsl:text>&lt;br align="left"/&gt;</xsl:text>
				</xsl:if>
			</xsl:for-each-group>
			<xsl:text>&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&gt;];&#xa;</xsl:text>
		</xsl:for-each-group>
		<xsl:for-each-group select="descendant::DataGroup" group-by="concat(parent::DataGroup/Group, Group)">
			<xsl:if test="parent::DataGroup/Group!=''  and Group!=parent::DataGroup/Group">
				<xsl:text>	"</xsl:text>
				<xsl:value-of select="parent::DataGroup/Group"/>
				<xsl:text>" -- "</xsl:text>
				<xsl:value-of select="Group"/>
				<xsl:text>" [headlabel="0..</xsl:text>
				<xsl:value-of select="max(current-group()/MaxOccurence)"/>
				<xsl:text>", taillabel="1" fontsize=10]&#xa;</xsl:text>
			</xsl:if>
		</xsl:for-each-group>
		<xsl:text>}</xsl:text>
	</xsl:template>
</xsl:stylesheet>
