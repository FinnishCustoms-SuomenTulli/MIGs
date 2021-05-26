<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:math="http://www.w3.org/2005/xpath-functions/math"
	xmlns:map="http://www.w3.org/2005/xpath-functions/map"
	xmlns:array="http://www.w3.org/2005/xpath-functions/array"
	exclude-result-prefixes="#all"
	version="3.0">

  <xsl:output method="text"/>
	<xsl:param name="language"/>
      <xsl:param name="system"/>

  <xsl:template match="/">
Graph <xsl:value-of select="$system"/> {
    node [shape=plaintext, fontname = "helvetica"];
    edge [fontname = "helvetica"];
    <xsl:for-each-group select="descendant::DataGroup" group-by="XPath">
        <xsl:variable name="currentNode">
            <xsl:choose>
                <xsl:when test="contains(XPath, '@')">
    				<xsl:value-of select="substring(substring-after(XPath,'function=&quot;'),0,string-length(substring-after(XPath,'function=&quot;')))"/>
                </xsl:when>
                <xsl:when test="XPath=''">
    				<xsl:value-of select="concat($system,'Operation')"/>
                </xsl:when>
                <xsl:otherwise>
    				<xsl:value-of select="XPath"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
    "<xsl:value-of select="$currentNode"/>" [label=&lt;&lt;table border="0" cellspacing="0" cellborder="1" color="#E3E5E9"&gt;&lt;tr&gt;&lt;td bgcolor="#00205B"&gt;&lt;font color="white"&gt;&lt;b&gt;<xsl:value-of select="Name[@lang=$language]"/>&lt;/b&gt;&lt;/font&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td bgcolor="#fafafa" align="left"&gt;<xsl:for-each select="DataElement"><xsl:value-of select="Name[@lang=$language]"/>&lt;br align="left"/&gt;</xsl:for-each>&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&gt;];</xsl:for-each-group>

    <xsl:for-each-group select="descendant::DataGroup" group-by="concat(parent::DataGroup/XPath,XPath)">
        <xsl:variable name="parentNode">
            <xsl:choose>
                <xsl:when test="parent::DataGroup/XPath=''">
    				<xsl:value-of select="concat($system,'Operation')"/>
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
                <xsl:otherwise>
    				<xsl:value-of select="XPath"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
    <xsl:if test="$parentNode!=''">
    "<xsl:value-of select="$parentNode"/>" -- "<xsl:value-of select="$currentNode"/>" [headlabel="<xsl:value-of select="min(MinOccurence)"/>..<xsl:value-of select="max(MaxOccurence)"/>", taillabel="1" fontsize=10]</xsl:if>
    </xsl:for-each-group>
}
  </xsl:template>
  
</xsl:stylesheet>