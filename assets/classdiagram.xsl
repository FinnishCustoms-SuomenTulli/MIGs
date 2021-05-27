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
		<xsl:for-each-group select="descendant::DataGroup" group-by="replace(XPath,'ConsignmentItem','GovernmentAgencyGoodsItem')">
			<xsl:variable name="currentNode">
				<xsl:choose>
					<xsl:when test="contains(XPath, '@')">
						<xsl:value-of select="substring(substring-after(XPath,'function=&quot;'),0,string-length(substring-after(XPath,'function=&quot;')))"/>
					</xsl:when>
					<xsl:when test="XPath=''">
						<xsl:value-of select="concat($system,'Operation')"/>
					</xsl:when>
					<xsl:when test="XPath='ConsignmentItem'">
						<xsl:value-of select="'GoodsItem'"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:text>	"</xsl:text>
			<xsl:value-of select="$currentNode"/>
			<xsl:text>" [label=&lt;&lt;table border="0" cellspacing="0" cellborder="1" color="#E3E5E9"&gt;&lt;tr&gt;&lt;td bgcolor="#00205B"&gt;&lt;font color="white"&gt;&lt;b&gt;</xsl:text>
			<xsl:value-of select="Name[@lang=$language]"/>
			<xsl:text>&lt;/b&gt;&lt;/font&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td bgcolor="#fafafa" align="left"&gt;</xsl:text>
			<xsl:for-each-group select="current-group()/DataElement" group-by="Name[@lang=$language]">
				<xsl:value-of select="Name[@lang=$language]"/>
				<xsl:text>&lt;br align="left"/&gt;</xsl:text>
			</xsl:for-each-group>
			<xsl:text>&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&gt;];&#xa;</xsl:text>
		</xsl:for-each-group>
		<xsl:for-each-group select="descendant::DataGroup" group-by="concat(replace(parent::DataGroup/XPath,'ConsignmentItem','GovernmentAgencyGoodsItem'),replace(XPath,'ConsignmentItem','GovernmentAgencyGoodsItem'))">
			<xsl:variable name="parentNode">
				<xsl:choose>
					<xsl:when test="parent::DataGroup/XPath=''">
						<xsl:value-of select="concat($system,'Operation')"/>
					</xsl:when>
					<xsl:when test="parent::DataGroup/XPath='ConsignmentItem' or parent::DataGroup/XPath='GovernmentAgencyGoodsItem'">
						<xsl:value-of select="'GoodsItem'"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="parent::DataGroup/XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name="currentNode">
				<xsl:choose>
					<xsl:when test="contains(XPath, '@')">
						<xsl:value-of select="substring(substring-after(XPath,'function=&quot;'),0,string-length(substring-after(XPath,'function=&quot;')))"/>
					</xsl:when>
					<xsl:when test="XPath='ConsignmentItem' or XPath='GovernmentAgencyGoodsItem'">
						<xsl:value-of select="'GoodsItem'"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:if test="$parentNode!=''">
				<xsl:text>	"</xsl:text>
				<xsl:value-of select="$parentNode"/>
				<xsl:text>" -- "</xsl:text>
				<xsl:value-of select="$currentNode"/>
				<xsl:text>" [headlabel="</xsl:text>
				<xsl:value-of select="min(current-group()/MinOccurence)"/>
				<xsl:text>..</xsl:text>
				<xsl:value-of select="max(current-group()/MaxOccurence)"/>
				<xsl:text>", taillabel="1" fontsize=10]&#xa;</xsl:text>
			</xsl:if>
		</xsl:for-each-group>
		<xsl:text>}</xsl:text>
	</xsl:template>
</xsl:stylesheet>
